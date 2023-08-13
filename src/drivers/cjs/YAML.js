const Driver = require('./BASE');

let yaml;
try {
  yaml = require('yaml');
  if (!yaml) yaml = require('js-yaml');
} catch (error) {};

module.exports = class YAMLDriver extends Driver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path, name) {
    super(path, name, '.yaml');

    if (!yaml) new Driver.Error({ message: `Please install 'yaml' or 'js-yaml' module to use this driver.` });

    Driver.write(this.path, yaml?.dump ? yaml.dump({}) : yaml.stringify({}), 'utf8');
    this.read();
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    const json = this.json();

    return (await super.clone(path, yaml.load ? yaml.load(json) : yaml.parse(json)));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    const json = this.json();

    return (await super.save(yaml.dump ? yaml.dump(json) : yaml.stringify(json), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(yaml?.load ?? yaml?.parse, 'utf8'));
  };
};