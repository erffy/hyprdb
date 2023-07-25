const Driver = require('./BASE');

let csv;
try {
  csv = require('csv');
} catch (error) {};

module.exports = class CSVDriver extends Driver {
  /**
   * Create new CSV-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.csv');

    if (!csv) throw new Driver.Error(`Please install 'csv' module to use this driver.`, { name: 'MissingModule' });
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, csv.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(csv.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(csv.parse, 'utf8');

    return void 0;
  };
};