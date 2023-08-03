import Driver from "./BASE.mjs";

let ini;
try {
  ini = (await import('ini')).default;
} catch (error) {};

export default class INIDriver extends Driver {
  /**
   * Create new INI-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.ini');

    if (!ini) new Driver.Error({ message: `Please install 'ini' module to use this driver.` });

    Driver.write(this.path, ini.stringify({}), 'utf8');
    this.read();
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, ini.stringify(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(ini.stringify(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(ini.parse, 'utf8'));
  };
};