const Driver = require('./BASE');

let json5;
try {
  json5 = require('json5');
} catch (error) {};

module.exports = class JSON5Driver extends Driver {
  /**
   * Create new JSON5-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name, spaces = 2) {
    super(path, name, '.json5');

    if (!json5) new Driver.Error({ message: `Please install 'json5' module to use this driver.` });

    /**
     * Database spaces.
     * @private
     */
    this.spaces = spaces;

    Driver.write(this.path, json5.stringify({}), 'utf8');
    this.read();
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, json5.stringify(this.json(), null, this.spaces)));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(json5.stringify(this.json(), null, this.spaces), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(json5.parse, 'utf8'));
  };
};