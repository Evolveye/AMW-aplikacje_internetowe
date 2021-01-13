import Module from "../baseModule.js";
import * as CONSTS from "../../src/constants/serverConsts.js";
import { stringifyObjValues } from "../../src/utils.js";
import {
  REFRESHING_INTERVAL_TIME_IN_MINUTES,
  TOKEN_EXPIRE_TIME_IN_MINUTES,
  ANSWERS,
  DEBUG,
} from './consts.js';
import emailsManager from "./mails.js";
import User from './model.js'
import { json } from "express";

// TODO: kody errorów.

/** @typedef {import('express').Express} Express */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/** @typedef {import('../../src/dbManager').default} DatabaseManager */
/** @typedef {import('../../src/ws').WS} WS */


/**
 * @typedef {object} Session
 * @property {number} lastActivity
 * @property {User} user
 * @property {string} token
 */



// TODO: how to route  into ->  index.html inside adam's public dir.
export default class UserModule extends Module {
  /** @type {Session[]} */
  // #sessions = [];

  /**
   * @param {Logger} logger
   * @param {DatabaseManager} dbManager
   */
  constructor(logger, dbManager) {
    super(logger, dbManager);

    setInterval(async () => {
      this.logger("DELETE EXPIRED TOKEN MECHANISM.");

      //this.#sessions = this.#sessions.filter(this.filterExpireTokens);

      await this.dbManager.deleteObjectsInCollection('usersSessions',
        {
          lastActivity:
          {// wszystko co nie spelnia warunku zostaje usuniete
            "$lt":
              Date.now() - TOKEN_EXPIRE_TIME_IN_MINUTES /* to ms */
          }
        }
      )

    }, REFRESHING_INTERVAL_TIME_IN_MINUTES);
  }

  // filterExpireTokens = async (obj) => {
  //   Date.now() - obj.lastActivity < TOKEN_EXPIRE_TIME_IN_MINUTES;
  // }



  /**
   * @param {Express} app
   */
  configure(app) {
   //TODO: Rename with prefix ws or http

    app.use(this.tokenRefreshMiddleware);

    app.get("/test", this.test)
    app.get("/users", this.getAllUsers); // TODO: production Remove.

    // localhost:3000/activate?code=1234 --> stronka adama - statycznie.
    // request  -> localhost:3000/api/activate/:code


    app.get("/api/activate/:code", this.acctivateAccountMiddleware);
    app.post("/api/logout", this.logoutMiddleware);
    app.post("/api/login", this.loginMiddleware);
    app.post("/api/register", this.registerMiddleware);
    app.post("/api/create/user", this.createUserMiddleware); // TODO: remove to platformModel. tworzenie użytkowników do platformy


    app.get("/api/users/me", this.httpAmIMiddleware);
    app.get("/api/users", this.getAllUsers); // TODO: AUTH ONLY restiction.  tutaj wywalam nawet password
    app.put("/api/users/me", this.updateUserSettings)


    app.post("/api/password/remind", this.passwordRemindMiddleware);
    app.post("/api/password/reset", this.passwordResetMiddleware); // update passw in db

  }

  passwordsSame = (password1, password2) => password1 == password2;

  updateUserSettings = async (req, res, next) => {
    const activeToken = this.getTokenFromRequest(req);
    if (!activeToken) res.status(400).json({ ERROR: ANSWERS.TOKEN_NOT_PROVIDED })

    if (activeToken) {
      // "login?": "string",
      // "name?": "string",
      // "surname?": "string",
      // "email?": "string",
      // "avatar?": "string",
      // "password?": "string",
      // "newPassword1?": "string",
      // "newPassword2?": "string",
      // cała paczka razem. {password,newPassword1,newPassword2}
      // login emai imie nazwisko



      const { login, name, surname, email, avatar, password, newPassword1, newPassword2 }
        = req.body;

      // pass1 == pass2 and != password
      // db overrride session


      user = req.body
      user = { name: `Adam`, surname: `Adam`, age: null, email: `` } // req.body
      notNullEntries = Object.entries(user).filter(([_, v]) => v)
      notNullUser = Object.fromEntries(notNullEntries)
      console.log(notNullUser)


      // makeUpdate = {}
      // //jak obsluzyc sam password?
      // {name:"nowy",...}
      const user = User()

      if (this.passwordsSame(newPassword1, newPassword2))
        makeUpdate.password = newPassword1


      if (login) makeUpdate.login = login
      if (name) makeUpdate.name = name
      if (surname) makeUpdate.surname = surname
      if (email) makeUpdate.email = email
      if (avatar) makeUpdate.avatar = avatar
      if (login) makeUpdate.login = login


      // dowiedz sie kto to wysłał.
      // make updat on db.,


      const findQuery = {};
      userToUpdate = this.getUserByToken(activeToken)
      if (userToUpdate) // znaleziono usera do update
      {
        await this.dbManager.updateObject('users', userToUpdate, makeUpdate);
      }

      return res.status(400).json({ ERROR: ANSWERS.TOKEN_NOT_EXIST })

    }

    res.status(501).json({ "not implemented": req.body })
  }

  createUserMiddleware = async (req, res, next) => {
    const { name, surname, email } = req.body;
    if (!(name && surname && email)) return res.status(400).json({ error: "Name surname or email was empty." });

    if (!UserModule.isEmailCorrect(email))
      return res.status(400).json({ error: "Wrong email." });

    if (!UserModule.isNameCorrect(name) && UserModule.isNameCorrect(surname))
      return res.status(400).json({ error: "Provided name or surname not match length requirements (min=2 max=32)" });


    const newUser = new User(name, surname, email, { activated: true })

    await this.saveUserInDb(newUser);

    delete newUser.password
    return res.status(200).json({ User: newUser });
  }


  passwordResetMiddleware = async (req, res, next) => {
    const resetObj = req.body;

    if (!this.passwordsSame(resetObj.password1, resetObj.password2)) {
      res.status(403).json({ error: ANSWERS.PASSWORDS_NOT_SAME });
    }

    if (!UserModule.isPasswordCorrect(resetObj.password1))
      return res.status(400).json({ error: "Password not passed polices." });


    if (!resetObj.code)
      return res.status(400).json({ error: "Reset password, can not found uniqueId in request body." });

    const emailObj = emailsManager.isActiveResetEmail(resetObj.code);
    if (emailObj) {
      const userObj = await this.dbManager.updateObject(
        `users`,
        { email: emailObj },
        { $set: { password: resetObj.password1 } }
      )

      res.status(200).json({ SUCCESS: ANSWERS.PASSWD_CHANGE_SUCCESS });
    }
    else {
      res.status(400).json({ error: ANSWERS.EMAIL_RESET_EXPIRED })
    }
  }

  passwordRemindMiddleware = async (req, res, next) => {

    const accountEmail = req.body.email;
    const user = await this.dbManager.findObject(`users`, { email: accountEmail })
    if (user) {
      //TODO: Production Uncoment.
      emailsManager.sendResetPasswordEmail(accountEmail);
      res.status(200).json({ SUCCESS: ANSWERS.PASSWD_REMIND_SUCCES })

    } else {
      res.status(400).json({ error: ANSWERS.PASSWD_REMIND_WRONG_EMAIL });
    }
  }

  /**
   *
   * @param {User} user new user to save.
   */
  saveUserInDb = async (user) => {
    await this.dbManager.insertObject(`users`, user)
  }

  /** @param {WS} socket */
  socketConfigurator = (socket) => {
    socket.userScope = { token: `` }

    console.log(`nowy socket`, socket.id)
    socket.on(`disconnect`, () => console.log(`socket wyszedł`, socket.id))

    socket.on('authenticate', (token) => {

      this.refreshToken(token);
      console.log({ AuthToken: token });
      const session = this.getSessionByToken(token);

      socket.userScope.token = token
    })

    socket.on('api.get.users.me', data => this.authorizedSocket(socket, async (token) => {
      const user = await this.getUserByToken(token);

      delete user.password;

      console.log("[WS] api.get.users.me --> "+JSON.stringify(user));
      socket.emit('api.get.users.me', user);
      //console.log("MARK #", user)
    }))
  }

  /**
   * @param {WS} socket
   * @param {(token:string) => void} cb
   */
  async authorizedSocket(socket, cb) {
    const { token } = socket.userScope;

    //console.log("TOKEN 1234 -> ", token);
    const tokenExist=await this.tokenExist(token);

    //console.log("EXIST Token 4567 =>", tokenExist);
    // console.log(`[WS] Authorization ${token}
    // Token exists ${JSON.stringify(tokenExist)} `)

    if (DEBUG || tokenExist) cb(token)
    else socket.emit(`not authenticated`)
  }


  logoutMiddleware = async (req, res, next) => {
    const authenticationToken = this.getTokenFromRequest(req);

    if (authenticationToken) {
      if (await this.tokenExist(authenticationToken)) {
        await this.deleteSessionByToken(authenticationToken);
        res.status(200).json({ SUCCESS: ANSWERS.LOGOUT_SUCCESS });
      }
      else {
        res.status(400).json({ error: ANSWERS.TOKEN_NOT_EXIST });
      }
    } else {
      res.status(400).json({ error: ANSWERS.TOKEN_NOT_PROVIDED });
    }
  }

  deleteSessionByToken = async token => {
    await this.dbManager.deleteObject('usersSessions', { token: token });
  }

  tokenExist = token => {
    return this.dbManager.findObject('usersSessions', { token: token });
  }



  tokenRefreshMiddleware = async (req, res, next) => {
    const authenticationToken = this.getTokenFromRequest(req);

    if (await this.tokenExist(authenticationToken)) { // found a authentication header.
      await this.refreshToken(authenticationToken)
    }

    // NOT found a authentication header.
    next();
  }



  async refreshToken(token) {
    await this.dbManager.updateObject('usersSessions', { token: token }, { $set: { lastActivity: Date.now() } })
  }


  /**
   *
   * @param {Request} request
   * @returns {string|false}
   */
  getTokenFromRequest = (request) => {
    const authentication = request.header("Authentication");

    if (authentication)
      return authentication.match(/Bearer (.*)/)[1]
    else
      false
  }

  test = async (req, res, next) => {
    //console.log( req.query)
    //res.status(200).json(await this.dbManager.getCollection('usersSessions'));
    res.json(emailsManager.getAllAcctivationEmails());
  }

  /**
   * Accepted path /users
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getAllUsers = async (req, res, next) => {
    res.status(200).json(await this.dbManager.getCollection(`users`))
  }



  /**
   * Accepted path /acctivate/:id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  acctivateAccountMiddleware = async (req, res, next) => {
    // localhost:3000/activate?code=1234
    // request  -> localhost:3000/api/activate/:code


    // client: /activate?code=1234
    // code ...
    // potem front fetchuje CI na backend: /api/activate/:code
    // api/accitvate/code
    // obsługujesz to tutaj dalej normalnie i zwracasz json
    //

    const accLogin = req.params.code;
    console.log({ LOGIN: accLogin });

    if (emailsManager.isActiveActivationEmail(accLogin)) {

      /** @type {User} */
      const targetUser = await this.dbManager.findObject(
        `users`,
        /**@param {User} obj */
        { login: accLogin }
      );

      if (!targetUser.activated) {//  not activated

        await this.dbManager.updateObject(
          `users`,
          { login: targetUser.login, },
          { $set: { activated: true } }
        );
        this.logger(`ACTIVATE USER: ${targetUser.name} ${targetUser.surname}`);

        next();
        res.status(200).json({ SUCCESS: ANSWERS.ACCOUNT_ACTIVATION_SUCCESS });
        // res.redirect('/activate');
      }
      else {// already activated
        res.status(200).json({ ERROR: ANSWERS.ACCOUNT_ALREADY_ACTIVATED });
      }
    } else { // email exired
      res.status(200).json({ ERROR: ANSWERS.EMAIL_ACTIVATE_EXPIRED });
    }
  }

  /**
   * Accepted path /api/me
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  httpAmIMiddleware = async (req, res, next) => {
    // TODO: Handle bad  request
    const authenticationToken = this.getTokenFromRequest(req);
    if (authenticationToken) { // has token and token exist in memeory db
      console.log(authenticationToken)
      console.log(await this.tokenExist(authenticationToken));

      if (await this.tokenExist(authenticationToken)) {
        const answer = await this.handleWhoAmI(authenticationToken)

        res.json({ User: answer });
      } else {
        res.status(401).json({ error: ANSWERS.TOKEN_NOT_EXIST })
      }
    } else { // token not provided
      res.status(401).json({ error: ANSWERS.TOKEN_NOT_PROVIDED });
    }
  };

  handleWhoAmI = async token => {
    console.log({ token })
    const user = await this.getUserByToken(token); // get user associated token.
    delete user.password;
    return user;
  }

  getSessionByToken = async (token) => {
    return await this.dbManager.findObject('usersSessions', { token: token });
  }

  getUserByToken = async (token) => {
    //const dataObj = await this.dbManager.findObject('usersSessions',{token:token})
    const dataObj = await this.getSessionByToken(token)
    return dataObj.user
  }

  /**
   * Accepted path /login
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  loginMiddleware = async (req, res, next) => {
    // W celu zalogowania się na stronie musi podać login i hasło.

    const { login, password } = stringifyObjValues(req.body)

    if (!(login && password)) {
      console.error(`ERROR`, { login, password })

      return res.status(400)
        .json({ error: ANSWERS.USER_NOT_EXIST });
    }

    this.logger(`REQUEST LOG-IN CREDENTIALS\n${JSON.stringify({ user: { login, password } })}`);

    /**@type {User} userObj */
    const userObj = await this.dbManager.findObject(`users`, { login, password });

    if (userObj) { // jest w bazie
      if (userObj.activated) { // aktywowany
        const query = {
          'user.login': userObj.login,
          'user.password': userObj.password,
          'user.email': userObj.email,
        }

        const activeUserSession = await this.dbManager.findObject('usersSessions', query);

        if (activeUserSession) { // czy już posiada sesję ?
          this.logger("WELCOME AGAIN:" + JSON.stringify({ user: { "name": userObj.name, "surname": userObj.surname } }))
          await this.refreshToken(activeUserSession.token);
          return res.status(200).json({ token: activeUserSession.token });
        }


        var token = Math.random().toString();
        this.logger("LOGGED IN => " + JSON.stringify({ token }))

        const activeSession = {
          lastActivity: Date.now(),
          user: userObj,
          token,
        }

        await this.dbManager.insertObject('usersSessions', activeSession)

        res.json({ token }); // or send and json stringify.
      } else {
        res.status(401).json({ error: ANSWERS.ACCOUNT_NOT_ACTIVATED });
      }
    } else {
      res.status(401).json({ error: ANSWERS.USER_NOT_EXIST });
    }

  };




  /**
   * path /register
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  registerMiddleware = async (req, res, next) => {
    // TODO: remove login to some token.
    this.logger(`REQUEST REGISTER ${JSON.stringify(req.body)}`);
    // rejestracji konta należy podać imię, nazwisko, email, hasło i powtórnie hasło.

    const { name, surname, email, password1, password2 } = stringifyObjValues(req.body)

    //console.log(stringifyObjValues(req.body))
    if (!this.passwordsSame(password1, password2))
      return res.status(400).json({ error: ANSWERS.PASSWORDS_NOT_SAME });


    /**@type {User} */
    const user = new User(name, surname, email,{password:password1});


    if (!UserModule.isPasswordCorrect(req.body.password1))
      return res.status(400).json({ error: "Password not passed polices." });

    if (!UserModule.isEmailCorrect(user.email))
      return res.status(400).json({ error: "Wrong email." });

    if (!UserModule.isNameCorrect(user.name) && UserModule.isNameCorrect(user.surname))
      return res.status(400).json({ error: "Provided name or surname not match length requirements (min=2 max=32)" });


    await this.saveUserInDb(user);
    emailsManager.sendAcctivationEmail(user.name, user.email, user.login);

    delete user.password

    res.json({ user });
  }

  /**
   * @param {string} argument
   * @param {number} [minLen]
   * @param {number} [maxLen]
   */
  static isNameCorrect = (argument, minLen = 2, maxLen = 32) => argument.length >= minLen && argument.length <= maxLen


  /** @param {string} email */
  static isEmailCorrect = (email) => {
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    return true
  }


  /** @param {string} password */
  static isPasswordCorrect(password) {
    const options = {
      minLenght: 5,
      maxLenght: 10,
      bannedChars: `{}|":<>?`,
      requireSpecialChar: false,
      specialChars: `!@#$%^*&()_+`,
      bannedWords: [``, `admin`, `ja`],
    }

    const arr = {
      minLen: password.length >= options.minLenght,
      maxLen: password.length <= options.maxLenght,
      notBannedChars: !password.split('').some((char) => options.bannedChars.includes(char)),
      specialChars: options.requireSpecialChar ? options.specialChars.split('').some(char => password.includes(char)) : true,
      notBannedWord: options.bannedWords.every((word) => word != password)
    }

    const minLen = password.length >= options.minLenght
    const maxLen = password.length <= options.maxLenght
    const notBannedChars = !password.split('').some((char) => options.bannedChars.includes(char))
    const specialChars = options.requireSpecialChar ? options.specialChars.split('').some(char => password.includes(char)) : true
    const notBannedWord = options.bannedWords.every((word) => word != password)

    //return minLen && maxLen && notBannedChars && specialChars && notBannedWord

    return true
  }

  toString = () => this.constructor.toString()
  static toString = () => "UserModule"
}
