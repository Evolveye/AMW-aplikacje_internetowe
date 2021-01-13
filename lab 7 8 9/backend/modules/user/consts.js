export const ONE_MINUTE = 1000 * 60
export const TOKEN_EXPIRE_TIME_IN_MINUTES = ONE_MINUTE * 30
export const REFRESHING_INTERVAL_TIME_IN_MINUTES = ONE_MINUTE * 1

export const ANSWERS = {
    USER_NOT_EXIST:"Cannot find user with passed credentials." , //{code:1,error: "Cannot find user with passed credentials."},
    USER_ALREADY_EXIST: "Credentials are already used.",
    PASSWORDS_NOT_SAME: "Password's are not the same.",
    TOKEN_NOT_PROVIDED:"Your request does not contain authentication token",
    PASSWD_CHANGE_SUCCESS:"Your password has been changed sucessfuly.",
    EMAIL_RESET_EXPIRED : "Reset email time expired ",
    EMAIL_ACTIVATE_EXPIRED: "Activate email time expired",
    PASSWD_REMIND_SUCCES:"Reset Password email has been sended. Check your E-mail",
    PASSWD_REMIND_WRONG_EMAIL:"Cannot find user with that email",
    LOGOUT_SUCCESS:"You has been logged out.",
    TOKEN_NOT_EXIST:"Provided token has propably expired or you are not logged in. Please login again.",
    ACCOUNT_ACTIVATION_SUCCESS:"Your account has ben activated successfully",
    ACCOUNT_ALREADY_ACTIVATED:"Account has ben already activated.",
    ACCOUNT_NOT_ACTIVATED:"Your acctount is not activated. Please check your adress email.",
}

const password = "secret123#"
const email = "sass.project.amw@gmail.com"

export const PASSW_RESET_ADDR = "http://localhost:3000/api/password/reset"
export const PASSW_RESET_FRONT_ADDR = "http://localhost:3000/password/reset"

export const ACTIVATE_REQUEST_ADDR = "http://localhost:3000/api/activate"
export const ACTIVATE_FRONT_ADDR = "http://localhost:3000/activate"

export const EMAIL = {
    ACTIVATION_EXPIRE_TIME: ONE_MINUTE * 30,
    PASSWD_RESET_EXPIRE_TIME: ONE_MINUTE * 10,
    ACCTIVATE_ACCOUNT_SUBJECT: "Verify your SASS Portal account.",
    PASSWORD_RESET_SUBJECT: "Reset your password.",
    GMAIL_SERVICE_NAME: "gmail",
    GMAIL_SERVICE_HOST: "smtp.gmail.com",
    GMAIL_SERVICE_SECURE: false,
    GMAIL_SERVICE_PORT: 587,
    GMAIL_USER_NAME: email,
    GMAIL_USER_PASSWORD: password,
}

export const DEBUG = false