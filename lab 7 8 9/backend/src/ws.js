import { json } from "express"
import WebSocket from "ws"

export default class WebSocketServer extends WebSocket.Server {
  /** @type {WS[]} */
  #clients = []

  getClients() {
    return this.#clients
  }

  /** @param {WebSocket} webSocket */
  reshapeWebSocket( webSocket ) {
    const ws = new WS( webSocket, this )

    this.#clients.push( ws )

    return ws
  }
}

export class WS {
  #id = `${Date.now()}#${Math.random().toString().slice( 2 )}`
  #commands = new Map()
  #defaultListener = () => {}

  /**@type {WebSocketServer} */
  #server = null

  /**
   * @param {WebSocket} ws
   * @param {WebSocketServer} server
   */
  constructor( ws, server ) {
    this.ws = ws
    this.ws.addEventListener( `message`, this.onmessage )

    this.#server = server
  }

  get id() {
    return this.#id
  }

  /**
   * @param {string} event
   * @param {*} data
   */
  emit( event, data ) {
    const msg = data ? { event, data } : event
    const send = () => this.ws.send( JSON.stringify( msg ) )

    // console.log( `TEST`, this.#id, this.ws.readyState, msg )

    if (this.ws.readyState !== 1) {
      this.ws.addEventListener( `open`, send )
    } else {
      send()
    }
  }
  /**
   * @param {(ws:WS) => boolean} predicate
   * @param {string} event
   * @param {*} data
   */
  emitTo( predicate, event, data ) {
    this.#server.getClients()
      .filter( predicate )
      .forEach( s => s.emit( event, data ) )
  }
  /**
   * @param {string} event
   * @param {*} data
   */
  broadcast( event, data ) {
    this.#server.getClients().forEach( s => s.emit( event, data ) )
  }

  on( event, listener ) {
    if (event === `disconnect`) this.ws.on( `close`, listener )
    else this.#commands.set( event, listener )
  }

  // onmessage = data => console.log( data )
  onmessage = ({ data }) => {
    let jsonData
    // console.log("[WS MESS]",data)
    try {
      jsonData = JSON.parse( data )
    } catch {
      jsonData = data
    }

  //   console.log( {"Commands": this.#commands,
  //   "has": this.#commands.has( jsonData ) ,
  //   "typeof":typeof jsonData === `string`

  // })

    if (typeof jsonData === `object` && `event` in jsonData && `data` in jsonData) {
      const { event, data } = jsonData

     
      if (this.#commands.has( event )) this.#commands.get( event )( data )
      else console.warn( `Unhandled event: ${event}` )
    } else if (typeof jsonData === `string` && this.#commands.has( jsonData )) {
      this.#commands.get( jsonData )( jsonData )
    } else this.#defaultListener( jsonData )
  }

  setDefaultListener( listener ) {
    if (typeof listener != `function`) throw new Error( `Listener should be the function type` )

    this.#defaultListener = listener
  }
}