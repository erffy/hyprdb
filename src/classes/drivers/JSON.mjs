import Driver from "./BASE.mjs";

export default class JSONDriver extends Driver {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name, spaces = 2) {
    super(path, name, '.json');

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
    return (await super.clone(path, JSON.stringify(this.json(), null, this.spaces)));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {    
    return (await super.save(JSON.stringify(this.json(), null, this.spaces)));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(JSON.parse, 'utf8'));
  };
};