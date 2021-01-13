import Grade from './model.js'
import Module from '../baseModule.js'

export default class gradeModule extends Module {

    #logger = null
    #dbManager = null
    /**
     * @param {Logger} logger
     * @param {DatabaseManager} dbManager
     */
    constructor(logger, dbManager) {
        this.#logger = logger
        this.#dbManager = dbManager
    }

    /**
    * @param {import('express').Express} app
    */
    configure(app) {

    }

    /** @param {import("socket.io").Socket} socket */
    socketConfigurator(socket) {

    }

    toString = () => this.constructor.toString()
    static toString = () => "Grade module."

    createGrade(groupId, userId, lecturerId, value, { description = '', date = null } = {}) {
        const newGrade = new Grade(userId, lecturerId, value, groupId, { description: description, date: date })
        /**
         * @typedef {Grade}
         * @property {string} userId
         * @property {number} date
         * @property {string} description
         * @property {nubmer} value
         * @property {string} lecturerId
         * @property {string} groupId
         *
         */
        console.log('newGrade', newGrade)

        throw new Error('create grades not impelemented');
        return newGrade;
        // todo: 
    }

    getGradeByGradeId(gradeId) {
        throw new Error('get grade not impelemented');
    }

    getGradesByUserId(userId) {
        throw new Error('get grade not impelemented');
    }

    editGrade(gradeId) {
        throw new Error('get grade not impelemented');
    }
}


