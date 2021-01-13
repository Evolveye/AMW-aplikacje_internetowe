// db platforms
import Module from "../baseModule.js";
import group from '../group/index.js'


export default class platformModule extends Module {
   /**
   * @param {Logger} logger
   * @param {DatabaseManager} dbManager
   */
    constructor(logger, dbManager) {
        this.#logger = logger
        this.#dbManager = dbManager
    }

    /**
    * @param {import('express').Express} app
    */
    configure(app) {

    }

    /** @param {import("socket.io").Socket} socket */
    socketConfigurator(socket) {

    }


    createPlatform(userId)


    toString = () => this.constructor.toString()
    static toString = () => "Platform module."
}