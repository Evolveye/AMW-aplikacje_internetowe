const PORT = 3000;
const __DIRNAME = import.meta.url.match(/(.*)\//)[1].substr(8).replace('/constants','');

/**
 * 
 */
export default  {
    PORT,
    APP_ROOT_DIR: __DIRNAME,
}
