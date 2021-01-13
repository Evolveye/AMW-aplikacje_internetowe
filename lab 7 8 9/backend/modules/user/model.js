
export default class User {
  /**
   * @param {string} name
   * @param {string} surname
   * @param {string} email
   * @param {object} param3
   * @param {string} param3.login
   * @param {string} param3.password
   * @param {boolean} param3.activated
   * @param {string} param3.avatar
   */
  constructor(name, surname, email, { password = null, login = null, activated = false, avatar = null } = {}) {
    this.name = name
    this.surname = surname
    this.email = email
    this.login = login ?? Math.random().toString()
    this.password = password ?? Math.random().toString().slice(2).substring(0, 4)
    this.activated = activated
    this.avatar = avatar ?? `/media/image/avatarDefault.jpg`
    this.createdDatetime = Date.now()
    // console.log(this);
  }
}
