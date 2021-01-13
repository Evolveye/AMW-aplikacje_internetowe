// lecturer or admin platformy.

/**
 * @typedef {Object} platform
 * @property {string} name
 * @property {string} owner
 * @property {string} created
 * @property {string} administrator
 * @property {string} organisationName
 */

export default class Platform {
    constructor(name,ownerId,organisationName = '') {
        this.name = name
        this.owner = ownerId // TODO: type =  User.
        this.created = Date.now()
        this.administrator = ownerId // TODO: type =  User.
        this.organisationName = organisationName

    }
}
