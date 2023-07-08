import Driver from './BASE.mjs';

import module from 'node:module';
const require = module.createRequire(import.meta.url);

export default class TOMLDriver extends Driver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.toml');

    /**
     * TOML.
     * @private
     */
    this.toml = require('@iarna/toml');
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.toml.stringify(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.toml.stringify(this.cache), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.toml.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};