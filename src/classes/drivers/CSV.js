const Driver = require('./BASE');

module.exports = class CSVDriver extends Driver {
  /**
   * Create new CSV-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.csv');

    /**
     * CSV.
     * @private
     */
    this.csv = require('csv');
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.csv.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.csv.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(this.csv.parse, 'utf8');

    return void 0;
  };
};