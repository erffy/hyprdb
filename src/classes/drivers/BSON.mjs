import Driver from './BASE.mjs';

export default class BSONDriver extends Driver {
  /**
   * Create new BSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.bson');

    /**
     * BSON.
     * @private
     */
    this.bson = Driver.require('bson-ext');
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.bson.serialize(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.bson.serialize(this.json()));

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(this.bson.deserialize);

    return void 0;
  };
};