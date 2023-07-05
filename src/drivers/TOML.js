const fs = require('fs-extra');

const _set = require('lodash.set');
const _get = require('lodash.get');
const _has = require('lodash.has');
const _unset = require('lodash.unset');
const _merge = require('lodash.merge');

const DatabaseError = require('../classes/DatabaseError');

module.exports = class TOMLDriver {
  /**
   * Create new TOML-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.toml') {
    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.toml')) path += '.toml';

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
    fs.writeFileSync(this.path, this.toToml(this.cache), { encoding: 'utf8' });

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
   * Convert object to toml.
   * @param {{}} object 
   * @returns {string}
   */
  toToml(object) {
    const data = JSON.parse(object);
    let tomlData = '';

    function processObject(obj, indent = '') {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          tomlData += `${indent}${key} = {\n`;
          processObject(obj[key], `${indent}  `);
          tomlData += `${indent}}\n`;
        } else tomlData += `${indent}${key} = ${formatValue(obj[key])}\n`;
      };
    };

    const formatValue = (value) => {
      if (typeof value === 'string') return `"${value}"`;
      return value;
    };

    processObject(data);

    return tomlData;
  };

  /**
   * Convert toml to object.
   * @param {string} toml 
   * @returns {{}}
   */
  toObject(toml) {
    const lines = toml.split('\n');
    const objectData = {};

    let currentObject = objectData;
    let currentArray = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === '') continue;
      if (trimmedLine.startsWith('#')) continue;
      if (trimmedLine.endsWith('}')) {
        const lastIndent = line.search(/\S/);

        if (currentArray) {
          const lastItem = currentArray[currentArray.length - 1];
          Object.assign(lastItem, currentObject);

          currentObject = currentArray;
          currentArray = null;
        } else {
          let diff = currentObject._indent - lastIndent;
          while (diff > 0) {
            currentObject = Object.getPrototypeOf(currentObject);
            diff--;
          };

          Object.assign(currentObject, currentObject._tempObject);
          delete currentObject._tempObject;
        };
      } else if (trimmedLine.endsWith(']')) {
        currentObject = currentArray;
        currentArray = null;
      } else if (trimmedLine.includes('=')) {
        const [key, value] = trimmedLine.split('=');
        const propName = key.trim();
        const propValue = this.parse(value.trim());

        if (currentArray) {
          const lastItem = currentArray[currentArray.length - 1];
          lastItem[propName] = propValue;
        } else currentObject[propName] = propValue;
      } else if (trimmedLine.endsWith('{')) {
        const newObject = Object.create(currentObject);
        newObject._tempObject = {};
        newObject._indent = line.search(/\S/);

        if (currentArray) currentArray.push(newObject._tempObject);
        else currentObject._tempObject = newObject._tempObject;

        currentObject = newObject;
      } else if (trimmedLine.endsWith('[')) {
        const newArray = [];

        currentObject = newArray;
        currentArray = newArray;
      };
    };

    return objectData;
  };

  /**
   * Parses value.
   * @param {unknown} value 
   * @returns {boolean | number | string}
   */
  parse(value) {
    if (value === 'true') return true;
    else if (value === 'false') return false;
    else if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
    else if (/^-?\d+\.?\d*$/.test(value)) return parseFloat(value);
  
    return value;
  };
};