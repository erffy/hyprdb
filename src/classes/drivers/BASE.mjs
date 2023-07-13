import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import module from 'node:module';

import _get from '../../functions/get.mjs';
import _has from '../../functions/has.mjs';
import _unset from '../../functions/unset.mjs';
import _set from '../../functions/set.mjs';
import _merge from '../../functions/merge.mjs';

import DatabaseError from '../DatabaseError.mjs';

const require = module.createRequire(import.meta.url);

/**
 * @abstract
 */
export default class BaseDriver {
  constructor(path, name, extension) {
    path ??= process.cwd();
    name ??= 'database';
    extension ??= '.json';

    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof name !== 'string') (new DatabaseError(`'${name}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof extension !== 'string') (new DatabaseError(`'${extension}' is not String.`, { name: 'TypeError' })).throw();

    path += name;
    if (!path.endsWith(extension)) path += extension;

    const __path = path.substring(0, path.lastIndexOf('/'));
    if (!existsSync(__path)) mkdirSync(__path, { recursive: true });

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

    /**
     * Driver cache.
     * @type {{}}
     * @readonly
     */
    this.cache = {};
  };

  /**
   * Set.
   * @param {string} key 
   * @param {unknown} value
   * @returns {unknown}
   */
  set(key, value) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    _set(this.cache, key, value);
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

    this.delete(key);
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

    return _get(this.cache, key);
  };

  /**
   * Has.
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    return _has(this.cache, key);
  };

  /**
   * Unset.
   * @param {string} key 
   * @returns {boolean}
   */
  unset(key) {
    if (typeof key !== 'string') throw new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' });

    const state = _unset(this.cache, key);
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
    if (typeof path !== 'string') throw new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' });

    const __path = path.substring(0, path.lastIndexOf('/'));
    if (!existsSync(__path)) mkdirSync(__path, { recursive: true });

    writeFileSync(path, bind, { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Save cache to database file.
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding 
   * @returns {void}
   */
  save(data, encoding) {
    writeFileSync(this.path, data, { encoding });

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @param {(data: unknown) => unknown} handler 
   * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} encoding
   * @returns {void}
   */
  read(handler, encoding) {
    const data = fs.readFileSync(this.path, { encoding });
    _merge(this.cache, handler(data));

    return void 0;
  };

  /**
   * Set.
   * @type typeof _set
   */
  static set = _set;

  /**
   * Get.
   * @type typeof _get
   */
  static get = _get;

  /**
   * Has.
   * @type typeof _has
   */
  static has = _has;

  /**
   * Merge.
   * @type typeof _merge
   */
  static merge = _merge;

  /**
   * Unset.
   * @type typeof _unset
   */
  static unset = _unset;

  /**
   * Error.
   * @type typeof DatabaseError
   */
  static Error = DatabaseError;

  /**
   * Require.
   * @type typeof require
   */
  static require = require;
};