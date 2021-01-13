import { Logger } from 'mongodb'
import Module from '../baseModule.js'

/**
 * @typedef {Object} Group
 * @property {string} boss
 * @property {string} name
 */
export default class groupModule extends Module {

    /**
     * 
     * @param {string} name new Group name
     * @param {string} headId 
     */

    getGroups()
    {
        // /api/platforms/id:number/groups

        idPlatform = id;
        groups = db.find('platforms',id)
        return groups
    }


    createGroup(name,headId)
    {
        


        throw new Error("create group not defined yet.")
    }

    getGroup(groupId)
    {
        throw new Error("get group not defined yet.")
    }

    getUsers(groupId) {
        throw new Error("get users group not defined yet.")
    }


    /**
     * @param {string} userId an  User Id of new group member.
     */
    addUser(groupId, userId) {/* make db collection */
        throw new Error("add user group not defined yet.")
    }

    /**
     * @param {string} userId an id of wanted user
     */
    containUser(groupId, userId) {
        throw new Error("contain user group not defined yet.")
        return this.#users.some(u => u.id == userId)
    }

    /**
     * @param {string} groupId an id of group
     * @param {string} userId an id of specyfic user
     */
    deleteUser(groupId, userId) {
        throw new Error("delete user group not defined yet.")
        this.#users = this.#users.filter(u => u.id != userId)
    }

    /**
     * 
     * @param {string} groupId an id of group
     */
    deleteGroup(groupId) { throw new Error("Cannot delete group yet.") }

}