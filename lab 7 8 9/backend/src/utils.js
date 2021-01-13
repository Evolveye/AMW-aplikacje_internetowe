import { LOG_ONLY_PAGES_ROUTE } from "./constants/serverConsts.js"
import Logger, { logUnderControl as logUnderCtrl } from "./Logger.js"

export const logUnderControl = logUnderCtrl



export function stringifyObjValues( obj ) {
  Object.entries( obj )
    .forEach( ([key, value]) => obj[ key ] = value.toString() )

  return obj
}



/** @param {import("express").Request} req */
export const isRequestPageRoute = req => !req.url.match( /\.[^\.]+$/ )
/** @param {import("express").Request} req */
export const doRequestLogShouldBePrinted = req =>
  LOG_ONLY_PAGES_ROUTE ? isRequestPageRoute( req ) : true



export const assertLogger = new Logger( [
  { align:`center`,  color:`white`,  value:`[ ` },
  { align:`center`,  color:`white` },
  { align:`center`,  color:`white`,  value:` ] ` },
  { align:`right`,   color:`blue`,   length:25 },
  { align:`center`,  color:`white`,  value:`:  ` },
  { align:`right`,   color:`white`,  length:10 },
  { align:`center`,  color:`yellow`, value:`  ===  ` },
  { align:`left`,    color:`white` },
] )
export function assert( name, a, b ) {
  const result = a === b
  const color = result ? `fgGreen` : `fgRed`
  const resultName = result ? `  OK ` : `ERROR`

  logUnderControl( assertLogger, `[${color}]${resultName}[]`, name, a, b )
}
