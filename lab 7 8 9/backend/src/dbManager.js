import { DB_CONN_STRING, DB_NAME, ERRORS } from './constants/dbConsts.js'
import mongoDb from 'mongodb'


class DatabaseManager {
  /**
   * @type {mongoDb.Db}
   */
  #db = null;

  constructor() {
    mongoDb.connect(DB_CONN_STRING, { useUnifiedTopology: true }, (error, mgClient) => {
      if (error)
        console.error(error)
      this.#db = mgClient.db(DB_NAME);

    });
  }

  /**
   *
   * @param {string} collectionName Name of collection
   * @returns {object[]}
   */
  async getCollection(collectionName) {
    if (await this.collectionExist(collectionName))
      return await this.#db.collection(collectionName).find().toArray()
  }

  /**
 *
 * @param {string} collectionName
 * @param {} findSchema unique {key:value}
 * @returns {object}
 */
  async findObject(collectionName, findSchema) {
   // console.log( "Schema ==>",findSchema)
    if (await this.collectionExist(collectionName)) {
      //console.log("FOUND ==>",await this.#db.collection(collectionName).findOne(findSchema))
      return await this.#db.collection(collectionName).findOne(findSchema);
    }
  }

  /**
   * updates object, find by specyfied unique {key:value} object,
   * new values of document are passed in {key:value} object
   *
   * @param {string} collectionName select the collection
   * @param {object} findPattern an object {key:value}, unique values that document in db can be identyfied.
   * @param {object} newValues an object {key:value}, updates keys by specyfied values
   */
  async updateObject(collectionName, findPattern, newValues) {
    if (await this.collectionExist(collectionName))
      await this.#db.collection(collectionName).updateOne((findPattern), (newValues))
  }

  async deleteObjectsInCollection(collectionName, filter) {
    if (await this.collectionExist(collectionName))
      await this.#db.collection(collectionName).deleteMany(filter);
  }


  async deleteObject(collectionName, query) {
    if (await this.collectionExist(collectionName)) {
      await this.#db.collection(collectionName).deleteOne(query);
    }
  }


  /**
   * 
   * @param {string} collectionName  name of colleciton.
   * @param {mongoDb.FilterQuery} query an unique key:value
   * @returns {boolean} true if found atleast 1 element, otherwise false.
   */
  async objectExist(collectionName, query) {
    const count = await this.#db.collection(collectionName).find(query).count()
    return count >= 1 ? true : false
  }

  /**
   *
   * @param {string} collectionName Name of collection.
   * @returns {boolean}
   */
  async collectionExist(collectionName) {
    const collectionArray = await this.#db.listCollections().toArray();
    return collectionArray.some((collection) => collection.name == collectionName && collection.type == 'collection');
  }

  /**
   *
   * @param {string} collectionName Name of collection that item will be inserted
   * @param {object} obj An item to insert.
   */
  async insertObject(collectionName, obj) {
    await this.#db.collection(collectionName).insertOne(obj);

  }
}

export default new DatabaseManager();

