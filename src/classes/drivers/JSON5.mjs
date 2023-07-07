import fs from 'node:fs';
import module from 'node:module';

import _get from '../../functions/get.mjs';
import _unset from '../../functions/unset.mjs';
import _set from '../../functions/set.mjs';
import _has from '../../functions/has.mjs';
import _merge from '../../functions/merge.mjs';

import DatabaseError from '../DatabaseError.mjs';

const require = module.createRequire(import.meta.url);

export default class JSON5Driver {
  /**
   * Create new JSON5-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.json5', spaces = 2) {
    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof spaces !== 'number') (new DatabaseError(`'${spaces}' is not Number.`, { name: 'TypeError' })).throw();

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.json5')) path += '.json5';

    /**
     * JSON5.
     * @private
     */
    this.json5 = (require('json5')).JSON5;

    /**
     * Database spaces.
     * @private
     */
    this.spaces = spaces;

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
    fs.writeFileSync(this.path, this.json5.stringify(this.cache, null, this.spaces), { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = fs.readFileSync(this.path, { encoding: 'utf8' });
    _merge(this.cache, this.json5.parse(data));

    return void 0;
  };
};