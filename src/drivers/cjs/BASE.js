const { mkdirSync, existsSync, writeFileSync } = require('node:fs');
const { readFile, writeFile } = require('node:fs/promises');
const { platform: _platform } = require('node:os');

const DatabaseError = require('../../error/DatabaseError');

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

    if (typeof path != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof path });
    if (name && typeof name != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof name });
    if (typeof extension != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof extension });

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
   * @returns {Promise<unknown>}
   */
  async set(key, value, autoWrite = true) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'key', received: typeof key });
    if (typeof autoWrite != 'boolean') new DatabaseError({ type: 'Validation', expected: 'boolean', received: typeof autoWrite });

    super.set(key, value);
    if (autoWrite) await this.save();

    return value;
  };

  /**
   * Edit.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {Promise<unknown>}
   */
  async edit(key, value) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'key', received: typeof key });

    if (!this.has(key)) return (await this.set(key, value));

    this.delete(key);

    return (await this.set(key, value));
  };

  /**
   * Get.
   * @param {string} key 
   * @returns {unknown}
   */
  get(key) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'key', received: typeof key });

    return super.get(key);
  };

  /**
   * Has.
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'key', received: typeof key });

    return super.has(key);
  };

  /**
   * Unset.
   * @param {string} key 
   * @returns {boolean}
   */
  async unset(key, autoWrite = true) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'key', received: typeof key });

    const state = this.delete(key);
    if (autoWrite) await this.save();

    return state;
  };

  /**
   * Clone.
   * @param {string} path 
   * @param {unknown} bind
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {Promise<void>}
   */
  async clone(path, bind, encoding) {
    path ??= `${this.path}-clone${this.extension}`;

    if (typeof path != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof path });
    if (path.length < 1) new DatabaseError({ message: 'Invalid path.' });

    const __path = path.substring(0, path.lastIndexOf('/'));
    if (__path.length > 0 && !existsSync(__path)) mkdirSync(__path, { recursive: true });

    return (await writeFile(path, bind, { encoding }));
  };

  /**
   * Save cache to database file.
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {Promise<void>}
   */
  async save(data, encoding) {
    return (await writeFile(this.path, Buffer.from(data), { encoding }));
  };

  /**
   * Read database file and save to cache.
   * @param {(data: unknown) => unknown} handler 
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {Promise<void>}
   */
  async read(handler, encoding) {
    if (typeof handler != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof handler });

    const data = await readFile(this.path, { encoding });

    let handled = handler(data);
    if (typeof handled?.then === 'function') handled = await handled.then((value) => value);

    if (typeof handled != 'object') new DatabaseError({ type: 'Validation', expected: 'object', received: typeof handled });

    for (const key in handled) super.set(key, handled[key]);

    return void 0;
  };

  /**
   * Convert database (cache) to object.
   * @returns {object}
   */
  json() {
    const obj = {};

    for (const [key, value] of this) BaseDriver.set(obj, key, value);

    return obj;
  };

  /**
   * Convert database to array.
   * @param {{ type?: 'all' | 'keys' | 'values' }} options
   * @returns {Array<string> | Array<unknown> | { keys: Array<string>, values: Array<unknown> } | void}
   */
  array(options = {}) {
    if (typeof options != 'object') new DatabaseError({ type: 'Validation', expected: 'object', received: typeof options });

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
   * @param {Record<string, any>} obj
   * @param {string} path
   * @param {unknown} value
   * @returns {object}
   */
  static set(obj, path, value) {
    if (typeof obj != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

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
   * @param {Record<string, any>} obj
   * @param {string} path
   * @returns {object}
   */
  static get(obj, path) {
    if (typeof obj != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

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
   * @param {Record<string, any>} obj
   * @param {string} path
   * @returns {boolean}
   */
  static has(obj, path) {
    if (typeof obj != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

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
   * @param {Record<string, any>} obj
   * @param {object} source
   * @returns {object}
   */
  static merge(obj, source) {
    if (typeof obj != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof source != 'object') throw new TypeError(`'${source}' is not object.`);

    for (const key in source) {
      if (typeof source[key] === 'object' && typeof obj[key] === 'object') BaseDriver.merge(obj[key], source[key]);
      else obj[key] = source[key];
    };

    return obj;
  };

  /**
   * Unset.
   * @param {Record<string, any>} obj
   * @param {string} path
   * @returns {boolean}
   */
  static unset(obj, path) {
    if (typeof obj != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

    const keys = path.split('.');

    for (let index = 0; index < (keys.length - 1); index++) {
      const key = keys[index];

      if (!obj[key]) return false;

      obj = obj[key];
    };

    delete obj[keys[keys.length - 1]];

    return true;
  };

  /**
   * Error.
   * @type typeof DatabaseError
   */
  static Error = DatabaseError;

  /**
   * Write.
   */
  static write(path, data, encoding) {
    if (existsSync(path)) return void 0;
    else return writeFileSync(path, data, { encoding });
  };
};