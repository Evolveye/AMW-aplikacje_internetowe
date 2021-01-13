/** @typedef {import('../src/dbManager').default} DatabaseManager */

export default class Module {
  /**
   * @param {(log:string) => void} logger
   * @param {DatabaseManager} dbManager
   */
  constructor( logger, dbManager ) {
    this.logger = logger
    this.dbManager = dbManager
  }

  /**
   * @param {import('express').Express} app
   */
  configure(app) {
    throw new Error( `You have to override me!` )
  }

  /** @param {import("socket.io").Socket} socket */
  socketConfigurator(socket){
    throw new Error( `You have to override me!` )
  }

  toString() {
    throw new Error( `You have to override me!` )
  }

  static toString() {
    throw new Error( `You have to override me!` )
  }
}