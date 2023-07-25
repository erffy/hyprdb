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
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, bson.serialize(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(bson.serialize(this.json()), 'binary');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(bson.deserialize);

    return void 0;
  };
};