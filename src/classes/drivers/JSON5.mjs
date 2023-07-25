import Driver from './BASE.mjs';

const json5 = await import('json5').then((module) => module.default).catch((error) => {});

export default class JSON5Driver extends Driver {
  /**
   * Create new JSON5-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name, spaces = 2) {
    super(path, name, '.json5');

    if (!json5) throw new Driver.Error(`Please install 'json5' module to use this driver.`, { name: 'MissingModule' });

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
    super.clone(path, json5.stringify(this.json(), null, this.spaces));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(json5.stringify(this.json(), null, this.spaces), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(json5.parse, 'utf8');

    return void 0;
  };
};