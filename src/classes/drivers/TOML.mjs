import Driver from './BASE.mjs';

const toml = await import('@iarna/toml').then((module) => module.default).catch((error) => {});

export default class TOMLDriver extends Driver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.toml');

    if (!toml) throw new Driver.Error(`Please install '@iarna/toml' module to use this driver.`, { name: 'MissingModule' });
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, toml.stringify(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(toml.stringify(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(toml.parse, 'utf8');

    return void 0;
  };
};