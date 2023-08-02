const Driver = require('./BASE');

let yaml;
try {
  const _yaml = require('yaml');
  yaml = { load: _yaml.parse, dump: _yaml.stringify };
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

    if (!yaml) throw new Driver.Error(`Please install 'yaml' or 'js-yaml' module to use this driver.`, { name: 'MissingModule' });

    this.read();
  };
  
  /**
   * Clone database.
   * @param {string} path 
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await super.clone(path, yaml.load(this.json())));
  };

  /**
   * Save cache to database file.
   * @returns {Promise<void>}
   */
  async save() {
    return (await super.save(yaml.dump(this.json()), 'utf8'));
  };

  /**
   * Read database file and save to cache.
   * @returns {Promise<void>}
   */
  async read() {
    return (await super.read(yaml.load, 'utf8'));
  };
};