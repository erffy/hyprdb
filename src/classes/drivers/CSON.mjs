import Driver from './BASE.mjs';

const cson = await import('cson').then((module) => module.default).catch((error) => {});

export default class CSONDriver extends Driver {
  /**
   * Create new CSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.cson');

    if (!cson) throw new Driver.Error(`Please install 'cson' module to use this driver.`, { name: 'MissingModule' });
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, cson.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(cson.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(cson.parse, 'utf8');

    return void 0;
  };
};