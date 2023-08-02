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

    this.read();
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, hjson.stringify(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(hjson.stringify(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(hjson.parse, 'utf8'));
  };
};