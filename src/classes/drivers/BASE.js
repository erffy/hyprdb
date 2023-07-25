const { writeFileSync, mkdirSync, existsSync } = require('node:fs');

const DatabaseError = require('../DatabaseError');

/**
 * @abstract
 */
module.exports = class BaseDriver extends Map {
  /**
   * @param {string} path 
   * @param {string} name 
   * @param {string} extension
   * @constructor
   */
  constructor(path, name = 'hypr', extension) {
    const platform = _platform();

    super();

    path ??= process.cwd();

    if (typeof path !== 'string') throw new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' });
    if (name && typeof name !== 'string') throw new DatabaseError(`'${name}' is not String.`, { name: 'TypeError' });
    if (typeof extension !== 'string') throw new DatabaseError(`'${extension}' is not String.`, { name: 'TypeError' });

    const __path = path.substring(0, path.lastIndexOf(platform != 'win32' ? '/' : '\\'));
    if (!existsSync(__path)) mkdirSync(__path, { recursive: true });

    if (name) path += (platform != 'win32' ? `/${name}` : `\\${name}`);
    if (!path.endsWith(extension)) path += extension;

    /**
     * Database Path.
     * @type string
     * @readonly
     * @protected
     */
    this.path = path;

    /**
     * Database Name.
     * @type string
     * @readonly
     * @protected
     */
    this.name = name;

    /**
     * Database Extension.
     * @type string
     * @readonly
     * @protected
     */
    this.extension = extension;
  };

  /**
   * Set.
   * @param {string} key 
   * @param {unknown} value
   * @returns {unknown}
   */
  set(key, value) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    super.set(key, value);
    this.save();

    return value;
  };

  /**
   * Edit.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   */
  edit(key, value) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    if (!this.has(key)) return this.set(key, value);

    this.unset(key);
    this.set(key, value);

    return value;
  };

  /**
   * Get.
   * @param {string} key 
   * @returns {unknown}
   */
  get(key) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    return super.get(key);
  };

  /**
   * Has.
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    return super.has(key);
  };

  /**
   * Unset.
   * @param {string} key 
   * @returns {boolean}
   */
  unset(key) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    const state = this.delete(key);
    this.save();

    return state;
  };

  /**
   * Clone.
   * @param {string} path 
   * @param {unknown} bind 
   * @returns {void}
   */
  clone(path, bind) {
    path ??= `${this.path}-clone${this.extension}`;

    if (typeof path !== 'string') throw new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' });
    if (path.length < 1) throw new DatabaseError(`'${path}' is not valid path.`, { name: 'RangeError' });

    const __path = path.substring(0, path.lastIndexOf('/'));
    if (__path.length > 0 && !existsSync(__path)) mkdirSync(__path, { recursive: true });

    writeFileSync(path, bind);

    return void 0;
  };

  /**
   * Save cache to database file.
   * @returns {void}
   */
  save(data) {
    return writeFileSync(this.path, Buffer.from(data));
  };

  /**
   * Read database file and save to cache.
   * @param {(data: unknown) => unknown} handler 
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {void}
   */
  read(handler, encoding) {
    const data = readFileSync(this.path, { encoding });

    const handled = handler(data);
    for (const key in handled) super.set(key, handled[key]);

    return void 0;
  };

  /**
   * Convert database (cache) to object.
   * @returns {object}
   */
  json() {
    const obj = {};

    const entries = this.entries();
    for (const [key, value] of entries) BaseDriver.set(obj, key, value);

    return obj;
  };

  /**
   * Convert database to array.
   * @param {{ type?: 'all' | 'keys' | 'values' }} options
   * @returns {Array<string> | Array<unknown> | { keys: Array<string>, values: Array<unknown> } | void}
   */
  array(options = {}) {
    if (typeof options !== 'object') throw new DatabaseError(`'${options}' is not Object.`, { name: 'TypeError' });

    options.type ??= 'all';

    const data = this.json();

    const array = [[], []];

    if (options.type === 'values') {
      for (const key in data) array[1].push(data[key]);

      return array[1];
    } else if (options.type === 'keys') {
      for (const key in data) array[0].push(key);

      return array[0];
    } else if (options.type === 'all') {
      for (const key in data) {
        array[0].push(key);
        array[1].push(data[key]);
      };

      return { keys: array[0], values: array[1] };
    };

    return void 0;
  };

  /**
   * Set.
   * @param {object} obj
   * @param {string} path
   * @param {unknown} value
   * @returns {object}
   */
  static set(obj, path, value) {
    if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
    if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

    const keys = path.split('.');

    for (let index = 0; index < (keys.length - 1); index++) {
      const key = keys[index];

      if (!obj[key]) obj[key] = {};

      obj = obj[key];
    };

    obj[keys[keys.length - 1]] = value;

    return obj;
  };

  /**
   * Get.
   * @param {object} obj
   * @param {string} path
   * @returns {object}
   */
  static get(obj, path) {
    if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
    if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

    const keys = path.split('.');

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (obj[key]) obj = obj[key];
      else return undefined;
    };

    return obj;
  };

  /**
   * Has.
   * @param {object} obj
   * @param {string} path
   * @returns {boolean}
   */
  static has(obj, path) {
    if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
    if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

    const keys = path.split('.');

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (obj[key]) obj = obj[key];
      else return false;
    };

    return true;
  };

  /**
   * Merge.
   * @param {object} obj
   * @param {object} source
   * @returns {object}
   */
  static merge(obj, source) {
    if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
    if (typeof source !== 'object') throw new TypeError(`'${source}' is not Object.`);

    for (const key in source) {
      if (typeof source[key] === 'object' && typeof obj[key] === 'object') BaseDriver.merge(obj[key], source[key]);
      else obj[key] = source[key];
    };

    return obj;
  };

  /**
   * Unset.
   * @param {object} obj
   * @param {string} path
   * @returns {boolean}
   */
  static unset(obj, path) {
    if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
    if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

    const keys = path.split('.');

    for (let index = 0; index < (keys.length - 1); index++) {
      const key = keys[index];

      if (!obj[key]) return false;

      obj = obj[key];
    };

    const lastKey = keys[keys.length - 1];
    delete obj[lastKey];

    return true;
  };

  /**
   * Error.
   * @type typeof DatabaseError
   */
  static Error = DatabaseError;
};