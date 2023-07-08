import Driver from "./BASE.mjs";

import module from 'node:module';
const require = module.createRequire(import.meta.url);

export default class INIDriver extends Driver {
  /**
   * Create new INI-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.ini');

    /**
     * INI.
     * @private
     */
    this.ini = require('ini');
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.ini.stringify(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.ini.stringify(this.cache), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.ini.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};