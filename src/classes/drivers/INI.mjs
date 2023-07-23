import Driver from "./BASE.mjs";

export default class INIDriver extends Driver {
  /**
   * Create new INI-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.ini');

    /**
     * INI.
     * @private
     */
    this.ini = Driver.require('ini');
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, this.ini.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(this.ini.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(this.ini.parse, 'utf8');

    return void 0;
  };
};