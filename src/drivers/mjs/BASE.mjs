import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';
import { platform as _platform } from 'node:os';

import DatabaseError from '../../error/DatabaseError.mjs';

/**
 * @abstract
 */
export default class BaseDriver extends Map {
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

    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });
    if (name && typeof name != 'string') new DatabaseError({ expected: 'string', received: typeof name });
    if (typeof extension != 'string') new DatabaseError({ expected: 'string', received: typeof extension });

    const __path = path.substring(0, path.lastIndexOf(platform != 'win32' ? '/' : '\\'));
    if (!existsSync(__path)) mkdirSync(__path, { recursive: true });

    if (name) path += (platform != 'win32' ? `/${name}` : `\\${name}`);
    if (!extension.startsWith('.')) extension = `.${extension}`;
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
   * @param {any} value
   * @returns {Promise<any>}
   */
  async set(key, value, autoWrite = true) {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });
    if (typeof autoWrite != 'boolean') new DatabaseError({ expected: 'boolean', received: typeof autoWrite });

    super.set(key, value);
    if (autoWrite) await this.save();

    return value;
  };

  /**
   * Get.
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });

    return super.get(key);
  };

  /**
   * Has.
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });

    return super.has(key);
  };

  /**
   * Unset.
   * @param {string} key 
   * @returns {boolean}
   */
  async unset(key, autoWrite = true) {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });

    const state = this.delete(key);
    if (autoWrite) await this.save();

    return state;
  };

  /**
   * Clone.
   * @param {string} path 
   * @param {any} bind
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {Promise<void>}
   */
  async clone(path, bind, encoding) {
    path ??= `${this.path}-clone${this.extension}`;

    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });
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
   * @param {(data: any) => any} handler 
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {Promise<void>}
   */
  async read(handler, encoding) {
    if (typeof handler != 'function') new DatabaseError({ expected: 'function', received: typeof handler });

    let data = await readFile(this.path, { encoding });
    data ??= '{}';

    let handled = handler(data);
    if (handled instanceof Promise) handled = await handled.then((value) => value);

    if (typeof handled != 'object') new DatabaseError({ expected: 'object', received: typeof handled });

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
   * @returns {Array<string> | Array<any> | { keys: Array<string>, values: Array<any> } | void}
   */
  array() {
    const data = this.json();

    const array = [[], []];

    for (const key in data) {
      array[0].push(key);
      array[1].push(data[key]);
    };

    return { keys: array[0], values: array[1] };
  };

  /**
   * Set.
   * @param {Record<string, any>} object
   * @param {string} path
   * @param {any} value
   * @returns {object}
   */
  static set(object, path, value) {
    if (typeof object != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

    const keys = path.split('.');

    for (let index = 0; index < (keys.length - 1); index++) {
      const key = keys[index];

      if (!object[key]) object[key] = {};

      object = object[key];
    };

    object[keys[keys.length - 1]] = value;

    return object;
  };

  /**
   * Get.
   * @param {Record<string, any>} object
   * @param {string} path
   * @returns {object}
   */
  static get(object, path) {
    if (typeof object != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

    const keys = path.split('.');

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (object[key]) object = object[key];
      else return undefined;
    };

    return object;
  };

  /**
   * Has.
   * @param {Record<string, any>} object
   * @param {string} path
   * @returns {boolean}
   */
  static has(object, path) {
    if (typeof object != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

    const keys = path.split('.');

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (object[key]) object = object[key];
      else return false;
    };

    return true;
  };

  /**
   * Merge.
   * @param {Record<string, any>} object
   * @param {object} source
   * @returns {object}
   */
  static merge(object, source) {
    if (typeof object != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof source != 'object') throw new TypeError(`'${source}' is not object.`);

    for (const key in source) {
      if (typeof source[key] === 'object' && typeof object[key] === 'object') BaseDriver.merge(object[key], source[key]);
      else object[key] = source[key];
    };

    return object;
  };

  /**
   * Unset.
   * @param {Record<string, any>} object
   * @param {string} path
   * @returns {boolean}
   */
  static unset(object, path) {
    if (typeof object != 'object') throw new TypeError(`'${obj}' is not object.`);
    if (typeof path != 'string') throw new TypeError(`'${path}' is not string.`);

    const keys = path.split('.');

    for (let index = 0; index < (keys.length - 1); index++) {
      const key = keys[index];

      if (!object[key]) return false;

      object = object[key];
    };

    delete object[keys[keys.length - 1]];

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