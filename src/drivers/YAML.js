const fs = require('fs-extra');

const _set = require('lodash.set');
const _get = require('lodash.get');
const _unset = require('lodash.unset');
const _has = require('lodash.has');
const _merge = require('lodash.merge');

const DatabaseError = require('../classes/DatabaseError');

module.exports = class YAMLDriver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.yaml') {
    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.yaml')) path += '.yaml';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    const __databasePath = path.substring(0, path.lastIndexOf('/'));
    if (!fs.existsSync(__databasePath)) fs.mkdirSync(__databasePath, { recursive: true });

    if (!fs.existsSync(this.path)) this.save();
    else this.read();
  };

  /**
   * Database cache.
   * @readonly
   */
  cache = {};

  /**
   * Push data to database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {void}
   */
  set(key, value) {
    _set(this.cache, key, value);
    this.save();

    return value;
  };

  /**
   * Update data entry in database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   */
  update(key, value) {
    if (!this.exists(key)) return this.set(key, value);

    this.delete(key);
    this.set(key, value);

    return value;
  };

  /**
   * Pull data from database. If available in cache, pulls from cache.
   * @param {string} key 
   * @returns {unknown}
   */
  get(key) {
    return _get(this.cache, key);
  };

  /**
   * Checks specified key is available in database.
   * @param {string} key 
   * @returns {boolean}
   */
  exists(key) {
    return _has(this.cache, key);
  };

  /**
   * Delete data from database.
   * @param {string} key 
   * @returns {boolean}
   */
  delete(key) {
    const state = _unset(this.cache, key);
    this.save();

    return state;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    fs.writeFileSync(this.path, this.toYaml(this.cache), { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = this.toObject(fs.readFileSync(this.path, { encoding: 'utf8' }));
    _merge(this.cache, data);

    return void 0;
  };

  /**
   * Convert object to yaml.
   * @param {{}} object 
   * @returns {string}
   */
  toYaml(object) {
    const data = JSON.parse(JSON.stringify(object));
    let yamlData = '';

    for (const key in data) {
      if (typeof data[key] === 'object') {
        yamlData += `${key}:\n`;

        for (const subKey in data[key]) yamlData += `  ${subKey}: ${data[key][subKey]}\n`;
      } else yamlData += `${key}: ${data[key]}\n`;
    };

    return yamlData;
  };

  /**
   * Convert yaml to object.
   * @param {string} yaml 
   * @returns {{}}
   */
  toObject(yaml) {
    const lines = yaml.split('\n');
    const obj = {};

    let currentIndent = 0;
    let currentObject = obj;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('#')) continue;

      const indentLevel = line.search(/\S/);

      if (indentLevel > currentIndent) {
        const key = trimmedLine.split(':')[0];
        currentObject[key] = {};
        currentObject = currentObject[key];
        currentIndent = indentLevel;
      } else if (indentLevel === currentIndent) {
        const [key, value] = trimmedLine.split(':');
        currentObject[key.trim()] = value.trim();
      } else {
        const diff = currentIndent - indentLevel;
        for (let i = 0; i < diff; i++) currentObject = Object.getPrototypeOf(currentObject);

        const [key, value] = trimmedLine.split(':');
        currentObject[key.trim()] = value.trim();
        currentIndent = indentLevel;
      };
    };

    return obj;
  };
};