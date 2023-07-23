const Driver = require('./BASE');

module.exports = class YAMLDriver extends Driver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
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
    super.clone(path, this.yaml.load(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.yaml.dump(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(this.yaml.load, 'utf8');

    return void 0;
  };
};