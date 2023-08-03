import Driver from './BASE.mjs';

let toml;
try {
  toml = (await import('smol-toml')).default;
  if (!toml) toml = (await import('@iarna/toml')).default;
} catch (error) {};

export default class TOMLDriver extends Driver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.toml');

    if (!toml) new Driver.Error({ message: `Please install 'smol-toml' or '@iarna/toml' module to use this driver.` });

    Driver.write(this.path, toml.stringify({}), 'utf8');
    this.read();
  };

  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, toml.stringify(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(toml.stringify(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(toml.parse, 'utf8'));
  };
};