

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


export default class Grade {
    constructor( userId, lecturerId, value,groupId, { date = null, description ='' })
    {
       // this.gradeId = gradeId
        this.userId = userId
        this.lecturerId=lecturerId
        this.date = date ??  Date.now()
        this.description = description ?? ``
        this.value = value
        this.groupId = groupId
    }
}