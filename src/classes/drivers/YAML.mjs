import Driver from './BASE.mjs';

let yaml;
await import('yaml').then((module) => yaml = { dump: module.default.stringify, load: module.default.parse }).catch((error) => {});
if (!yaml) await import('js-yaml').then((module) => yaml = module.default).catch((error) => {});

export default class YAMLDriver extends Driver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.yaml');

    if (!yaml) throw new Driver.Error(`Please install 'yaml' or 'js-yaml' module to use this driver.`, { name: 'MissingModule' });
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {void}
   */
  clone(path) {
    super.clone(path, yaml.load(this.json()));

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    super.save(yaml.dump(this.json()), 'utf8');

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    super.read(yaml.load, 'utf8');

    return void 0;
  };
};