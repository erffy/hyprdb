import Driver from "./BASE.mjs";

let hjson;
try {
  hjson = await import('hjson');
} catch (error) {};

export default class HJSONDriver extends Driver {
  /**
   * Create new HJSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.hjson');

    if (!hjson) new Driver.Error({ message: `Please install 'hjson' module to use this driver.` });
    
    Driver.write(this.path, hjson.stringify({}), 'utf8');
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