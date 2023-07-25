const Driver = require('./BASE');

let ini;
try {
  ini = require('ini');
} catch (error) {};

module.exports = class INIDriver extends Driver {
  /**
   * Create new INI-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.ini');

    if (!ini) throw new Driver.Error(`Please install 'ini' module to use this driver.`, { name: 'MissingModule' });
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, ini.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(ini.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(ini.parse, 'utf8');

    return void 0;
  };
};