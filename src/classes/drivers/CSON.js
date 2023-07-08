const Driver = require('./BASE');

module.exports = class CSONDriver extends Driver {
  /**
   * Create new CSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database') {
    super(path, name, '.cson');

    /**
     * CSON.
     * @private
     */
    this.cson = require('cson');
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.cson.stringify(this.cache));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.cson.stringify(this.cache), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.cson.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};