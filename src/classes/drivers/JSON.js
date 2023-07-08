const Driver = require('./BASE');

module.exports = class JSONDriver extends Driver {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name = 'database', spaces = 2) {
    super(path, name, '.json');

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
    super.clone(path, JSON.stringify(this.cache, null, this.spaces));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(Buffer.from(JSON.stringify(this.cache, null, this.spaces)), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = super.read(JSON.parse, 'utf8');
    Driver.merge(this.cache, data);

    return void 0;
  };
};