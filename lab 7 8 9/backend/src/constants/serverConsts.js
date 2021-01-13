import Logger from "../Logger.js"

export const PORT = 3000;
export const APP_ROOT_DIR = import.meta.url.match(/(.*)\//)[1].substr(8).replace('/src/constants','');

export const LOG_ONLY_PAGES_ROUTE = true

export const LOGGERS = {
  routes: new Logger( [
    { align:`left`,   color:`white`,   value:`[{hh}:{mm}:{ss}]` },
    { align:`right`,  color:`magenta`, value:`  NEW REQUEST` },
    { align:`center`, color:`white`,   value:`   --> ` },
    { align:`right`,  color:`blue`,    length:6  },
    { align:`center`, color:`white`,   value:` :: ` },
    { align:`left`,   color:`yellow` },
  ], { separated:true } ),
  server: new Logger( [
    { align:`left`,   color:`white`,   value:`[{hh}:{mm}:{ss}]` },
    { align:`right`,  color:`magenta`, value:`  SERVER INFO` },
    { align:`center`, color:`white`,   value:`: ` },
    { align:`left`,   color:`white` },
  ], { separated:true } ),
  module: new Logger( [
    { align:`left`,   color:`white`,   value:`[{hh}:{mm}:{ss}]` },
    { align:`right`,  color:`blue`,    value:`  MODULE INFO` },
    { align:`center`, color:`white`,   value:`: ` },
    { align:`right`,  color:`yellow`,  length:13 },
    { align:`center`, color:`white`,   value:`: ` },
    { align:`left`,   color:`white`,   firstSplitLen:40, splitLen:80 },
  ], { separated:true, separateBreakBlock:true } ),
}