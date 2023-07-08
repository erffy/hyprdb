import Driver from './BASE.mjs';

import module from 'node:module';
const require = module.createRequire(import.meta.url);

export default class YAMLDriver extends Driver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.yaml');

    /**
     * YAML.
     * @private
     */
    this.yaml = require('js-yaml');
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.yaml.load(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.yaml.dump(this.cache), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.yaml.load, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};