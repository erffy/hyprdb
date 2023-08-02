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

    this.read();
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, json5.stringify(this.json(), null, this.spaces)));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(json5.stringify(this.json(), null, this.spaces), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(json5.parse, 'utf8'));
  };
};