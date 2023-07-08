const Driver = require('./BASE');

module.exports = class JSON5Driver extends Driver {
  /**
   * Create new JSON5-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database', spaces = 2) {
    super(path, name, '.json5');

    /**
     * JSON5.
     * @private
     */
    this.json5 = (require('json5')).JSON5;

    /**
     * Database spaces.
     * @private
     */
    this.spaces = spaces;
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.json5.stringify(this.cache, null, this.spaces));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.json5.stringify(this.cache, null, this.spaces), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(this.json5.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};