import { assert } from "./src/utils.js"

import dbManager from "./src/dbManager.js"

import UserModule from "./modules/user/index.js"

const { userModule } = setup()



assert( "Test log - false", 1, 2 )
assert( "Test log - true",  3, 3 )

assert( "Test hasła - digits",   UserModule.isPasswordCorrect("12345"), false )
assert( "Test hasła - length",   UserModule.isPasswordCorrect("abcdefghijklrmoprst"), false)
assert( "Test hasła - correct",  UserModule.isPasswordCorrect("12345!%#$"), true )
assert( "Test hasła - bad word", UserModule.isPasswordCorrect("admin"), false )
assert( "Test hasła - length",   UserModule.isPasswordCorrect("abc"), false )
assert( "Test hasła - bad char", UserModule.isPasswordCorrect("adam123?"), false )
assert( "Test hasła - correct",  UserModule.isPasswordCorrect("mikolaj@"), true )



function setup(){
  return {
    userModule: new UserModule( console.log, dbManager ),
  }
}