import fs from 'fs-extra';

import _get from 'lodash.get';
import _has from 'lodash.has';
import _unset from 'lodash.unset';
import _set from 'lodash.set';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import DatabaseError from '../classes/DatabaseError.mjs';

export default class YAMLDriver {
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
     * YAML.
     * @private
     */
    this.yaml = require('yaml');

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    const __databasePath = path.substring(0, path.lastIndexOf('/'));
    if (!fs.existsSync(__databasePath)) fs.mkdirSync(__databasePath, { recursive: true });

    if (!fs.existsSync(this.path)) this.save();
    else this.load();
  };

  /**
   * Database cache.
   * @readonly
   */
  cache = {};

  /**
   * Read database file and convert to object.
   * @returns {{}}
   */
  get json() {
    return JSON.parse(JSON.stringify(this.yaml.parse(fs.readFileSync(this.path, { encoding: 'utf8' })) ?? {}));
  };

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
    fs.writeFileSync(this.path, this.yaml.stringify(this.cache), { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Save database file to cache.
   * @returns {typeof this.cache}
   */
  load() {
    this.cache = this.json;

    return this.cache;
  };
};