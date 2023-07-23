const Driver = require('./BASE');

module.exports = class TOMLDriver extends Driver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
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
    super.clone(path, this.toml.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.toml.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(this.toml.parse, 'utf8');

    return void 0;
  };
};