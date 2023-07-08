import Driver from './BASE.mjs';

import module from 'node:module';
const require = module.createRequire(import.meta.url);

export default class BSONDriver extends Driver {
  /**
   * Create new BSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.bson');

    /**
     * BSON.
     * @private
     */
    this.bson = require('bson-ext');
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.bson.serialize(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.bson.serialize(this.cache), 'binary');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.bson.deserialize);
    Driver.merge(this.cache, data);

    return void 0;
  };
};