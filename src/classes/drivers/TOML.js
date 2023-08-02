const Driver = require('./BASE');

let toml;
try {
  toml = require('toml');
} catch (error) {};

module.exports = class TOMLDriver extends Driver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.toml');

    if (!toml) throw new Driver.Error(`Please install '@iarna/toml' module to use this driver.`, { name: 'MissingModule' });

    this.read();
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, toml.stringify(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(toml.stringify(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(toml.parse, 'utf8'));
  };
};