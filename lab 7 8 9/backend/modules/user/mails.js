import nodemail from "nodemailer";

// TODO, potrzebuje sprawdzac w db, czy user juz zostal aktywowany.

import {
  PASSW_RESET_ADDR,
  ACTIVATE_REQUEST_ADDR,
  ACTIVATE_FRONT_ADDR,
  EMAIL,
  REFRESHING_INTERVAL_TIME_IN_MINUTES,
  PASSW_RESET_FRONT_ADDR,
} from "./consts.js";

class EmailManager {
  #acctivateCollection = [];
  #passwResetCollection = [];


  #transporter = nodemail.createTransport({
    host: EMAIL.GMAIL_SERVICE_HOST,
    port: EMAIL.GMAIL_SERVICE_PORT,
    secure: EMAIL.GMAIL_SERVICE_SECURE,
    tls: { rejectUnauthorized: false },
    auth: {
      user: EMAIL.GMAIL_USER_NAME,
      pass: EMAIL.GMAIL_USER_PASSWORD,
    },
  });

  constructor() {

    setInterval(() => { // Acctivation email's
      console.log("DELETE EXPIRED ACCTIVATION EMAIL MECHANISM.");
      this.#acctivateCollection = this.#acctivateCollection.filter(this.filterExpireActivationEmails);
    }, REFRESHING_INTERVAL_TIME_IN_MINUTES);

    setInterval(() => {// Reset Passwd email's
      console.log("DELETE EXPIRED PASSWD EMAIL MECHANISM.");
      this.#passwResetCollection = this.#passwResetCollection.filter(this.filterExpireResetEmails);
    }, REFRESHING_INTERVAL_TIME_IN_MINUTES);
  }


  /**
   * 
   * @param {Object} obj type of emailCollObj.
   */
  filterExpireResetEmails = (obj) => (Date.now() - obj.SEND_DATE) < EMAIL.PASSWD_RESET_EXPIRE_TIME; // nie minelo .

  getAllAcctivationEmails = ()=>this.#acctivateCollection;
  getAllResetEmails = ()=>this.#acctivateCollection;

  /**
   * 
   * @param {Object} obj type of emailCollObj.
   */
  filterExpireActivationEmails = (obj) => (Date.now() - obj.SEND_DATE) < EMAIL.ACTIVATION_EXPIRE_TIME; // nie minelo .

  /**
   * Checks that an account can be activated.
   * 
   * @param {number} login 
   * @returns {boolean} 
   */
  isActiveActivationEmail(login) {
    //TODO: refactor return user OBJ or false.

    const collObj = this.#acctivateCollection.find((obj, idx) => obj.USER_ID == login);

    if (collObj) {
      const idx = this.#acctivateCollection.indexOf(collObj);
      this.#acctivateCollection.splice(idx, 1); // delete email obj in collection.
      return true;
    }
    return false;
  }

  /**
    * Checks that an account can be activated. If can the email will be deleted. otherwise false.
    * 
    * @param {number} login 
    * @returns {string|boolean}  restuns  
    */
  isActiveResetEmail(uniqueId) {
    //TODO: refactor return user OBJ or false.

    const collObj = this.#passwResetCollection.find(
      (obj, idx) => obj.UNIQUE_ID == uniqueId
    );

    if (collObj) {
      const idx = this.#passwResetCollection.indexOf(collObj);
      this.#passwResetCollection.splice(idx, 1); // delete email obj in collection.
      return collObj.EMAIL;
    }
    return false;
  }

  findEmailById(passwResetUniqueCode) {
    const resetemailobj = this.#passwResetCollection.find((obj) => obj.UNIQUE_ID == passwResetUniqueCode);
    return resetemailobj.EMAIL;
  }

  removeResetEmail(passwResetUniqueCode) {
    this.#passwResetCollection = this.#passwResetCollection.filter(obj => obj.UNIQUE_ID != passwResetUniqueCode);
  }


  /**
   * 
   * @returns {number} uniqueId.
   */
  sendResetPasswordEmail(email) {
    var uniqueId = Math.random();

    const mailOptions = {
      from: EMAIL.GMAIL_USER_NAME,
      to: email,
      subject: EMAIL.PASSWORD_RESET_SUBJECT,
      html: `<h1><a href="${PASSW_RESET_FRONT_ADDR}?code=${uniqueId}"> RESET PASSWORD </a></h1>
             <br/> ${PASSW_RESET_ADDR} --> make  post call.
             
      `,
    };
    const emailCollObj = {
      EMAIL_OPTIONS: mailOptions,
      SEND_DATE: Date.now(),
      UNIQUE_ID: uniqueId,
      EMAIL: email,
    }

    this.#transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Cannot send e-mail", { err });
      } else {
        const emailCollObj = {
          EMAIL_OPTIONS: mailOptions,
          SEND_DATE: Date.now(),
          UNIQUE_ID: uniqueId,
          EMAIL: email,
        };
        console.log(`Reset Passw send --> `, { email: emailCollObj.EMAIL_OPTIONS.to });
        this.#passwResetCollection.push(emailCollObj);
      }
    });

  }

  /**
   * 
   * @param {string} name User name.
   * @param {string} email User personal e-mail.
   * @param {number} userID User login.
   */
  sendAcctivationEmail(name, email, userID) {
    const mailOptions = {
      from: EMAIL.GMAIL_USER_NAME,
      to: email,
      subject: EMAIL.ACCTIVATE_ACCOUNT_SUBJECT,
      html: `<h1><a href="${ACTIVATE_FRONT_ADDR}?code=${userID}"> Acctivate PAGE </a></h1>
             <br/><a href="${ACTIVATE_REQUEST_ADDR}/${userID}"> API ACCTIVATE REQUEST </a>
      `,
    };
   // console.log({ mailOptions });
    this.#transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Cannot send e-mail", { err });
      } else {
        const emailCollObj = {
          EMAIL_OPTIONS: mailOptions,
          SEND_DATE: Date.now(),
          USER_ID: userID,
        };
        this.#acctivateCollection.push(emailCollObj);
        console.log(`Email succesfully. USER LOGIN ${userID} E-MAIL ${emailCollObj.EMAIL_OPTIONS.to}`);
      }
    });
  }
}

export default new EmailManager();
