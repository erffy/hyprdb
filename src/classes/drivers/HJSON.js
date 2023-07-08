const Driver = require('./BASE');

module.exports = class HJSONDriver extends Driver {
  /**
   * Create new HJSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.hjson');

    /**
     * HJSON.
     * @private
     */
    this.hjson = require('hjson');
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.hjson.stringify(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.hjson.stringify(this.cache), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.hjson.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};