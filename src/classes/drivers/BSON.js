const Driver = require('./BASE');

let bson;
try {
  bson = require('bson');
  if (!bson) bson = require('bson-ext');
} catch (error) {};

module.exports = class BSONDriver extends Driver {
  /**
   * Create new BSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.bson');

    if (!bson) throw new Driver.Error(`Please install 'bson' or 'bson-ext' module to use this driver.`, { name: 'MissingModule' });

    this.read();
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, bson.serialize(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(bson.serialize(this.json())));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(bson.deserialize));
  };
};