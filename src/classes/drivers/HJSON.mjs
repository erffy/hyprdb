import Driver from "./BASE.mjs";

const hjson = await import('hjson').then((module) => module.default).catch((error) => {});

export default class HJSONDriver extends Driver {
  /**
   * Create new HJSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.hjson');

    if (!hjson) throw new Driver.Error(`Please install 'hjson' module to use this driver.`, { name: 'MissingModule' });
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, hjson.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(hjson.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(hjson.parse, 'utf8');

    return void 0;
  };
};