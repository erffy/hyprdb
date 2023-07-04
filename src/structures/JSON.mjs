import fs from 'fs-extra';
import JSONStream from 'JSONStream';
import { Transform } from 'node:stream';

import _get from 'lodash.get';
import _unset from 'lodash.unset';
import _set from 'lodash.set';
import _has from 'lodash.has';
import _merge from 'lodash.merge';

import DatabaseError from '../classes/DatabaseError.mjs';

export default class JSONDriver {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.json') {
    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.json')) path += '.json';

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
   * Create database file.
   * @returns {void}
   */
  write() {
    fs.writeFileSync(this.path, '', { encoding: 'utf8' });

    return void 0;
  }
  /**
   * Save cache to database file.
   * @returns {void}
   */
  save() {
    const writeStream = fs.createWriteStream(this.path, { encoding: 'utf8' });
    const stream = JSONStream.stringify();
    stream.pipe(writeStream);
    stream.end(this.cache);

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const stream = fs.createReadStream(this.path, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');

    const transform = new Transform({ objectMode: true, transform: (chunk, encoding, callback) => { _merge(this.cache, chunk); callback(); } });

    stream.pipe(parser);
    stream.pipe(transform);

    return void 0;
  };

  /**
   * Save database file to cache.
   * @returns {typeof this.cache}
   */
  load() {
    this.read();

    return this.cache;
  };
};