const Driver = require('./BASE');

let cson;
try {
  cson = require('cson');
} catch (error) {};

module.exports = class CSONDriver extends Driver {
  /**
   * Create new CSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.cson');

    if (!cson) throw new Driver.Error(`Please install 'cson' module to use this driver.`, { name: 'MissingModule' });

    this.read();
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, cson.stringify(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(cson.stringify(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(cson.parse, 'utf8'));
  };
};