import DatabaseError from '../error/DatabaseError.mjs';

import * as Drivers from '../drivers/index.mjs';

/**
 * Hyper Database.
 * @class Database
 */
export default class Database {
  /**
   * Create new Database.
   * @param {DatabaseOptions} options
   * @constructor
   */
  constructor(options = {}) {
    options.size ??= 0;
    options.spaces ??= 2;
    options.overWrite ??= false;
    options.autoWrite ??= true;

    if (typeof options.size != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof options.size });
    if (typeof options.overWrite != 'boolean') new DatabaseError({ type: 'Validation', expected: 'boolean', received: typeof options.overWrite });
    if (typeof options.autoWrite != 'boolean') new DatabaseError({ type: 'Validation', expected: 'boolean', received: typeof options.autoWrite });
    if (typeof options.spaces != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof options.spaces });

    options.driver ??= new Drivers.JSONDriver(options?.path, options?.name, options.spaces);
    if (!(options.driver instanceof Drivers.Base)) new DatabaseError({ message: `'${options.driver}' is not valid driver instance.` });

    /**
     * Database Options.
     * @type typeof options
     * @private
     */
    Object.defineProperty(this, 'options', { value: options, writable: false, configurable: false });

    /**
     * Database size.
     * @type number
     * @readonly
     */
    this.size = this.array({ type: 'keys' }).length;
  };

  /**
   * Assign this database to other database.
   * @param {class} other 
   * @param {{ callbackName?: string }} options
   * @returns {Record<string, boolean>}
   */
  assign(other, options = {}) {
    if (typeof options != 'object') new DatabaseError({ type: 'Validation', expected: 'object', received: typeof options });
    if (!other?.constructor) new DatabaseError({ message: `'${options?.constructor}' is not valid constructor.` });

    options.callbackName ??= 'set';

    const obj = {};

    const data = this.json();
    for (const key in data) {
      if (typeof other[options.callbackName] != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof options.callbackName });

      try {
        other[options.callbackName](key, data[key]);
        obj[key] = true;
      } catch (error) {
        throw new DatabaseError(`An error ocurred when assign. (${error})`);
      };
    };

    return obj;
  };

  /**
   * Get key or value with index.
   * @param {number} keyIndex 
   * @param {number} valueIndex 
   * @returns {string | any | { key: string, value: any }}
   * @example db.at(0, 1); db.at(null, 0); db.at(1, null);
   */
  at(keyIndex, valueIndex) {
    keyIndex ??= 0;
    valueIndex ??= 0;

    if (typeof keyIndex != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof keyIndex });
    if (typeof valueIndex != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof valueIndex });

    const array = this.array();

    const key = array.keys[keyIndex];
    const value = array.values[valueIndex];

    return { key, value };
  };

  /**
   * Get all data from database.
   * @param {number} amount 
   * @returns {Array<{ key: string, value: any }>}
   * @example db.all();
   */
  all(amount = 0) {
    if (typeof amount != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof amount });

    const obj = this.json();

    let results = [];
    for (const key in obj) results.push({ key, value: obj[key] });

    if (amount > 0) results = results.splice(0, amount);

    return results;
  };

  /**
   * Convert database to array.
   * @param {{ type?: 'all' | 'keys' | 'values' }} options
   * @returns {Array<string> | Array<any> | { keys: Array<string>, values: Array<any> } | void}
   * @example db.array(); db.array({ type: 'keys' }); db.array({ type: 'values' });
   */
  array(options) {
    return this.options.driver.array(options);
  };

  /**
   * Add specified number of values to the specified key.
   * @param {string} key 
   * @param {number} amount
   * @param {boolean} negative
   * @returns {number}
   * @example db.add('result', 3);
   */
  add(key, amount = 1, negative = false) {
    return this.math(key, this.get(key), '+', amount, negative);
  };

  /**
   * Clone database. (like Backup.)
   * @param {string} path
   * @returns {Promise<void>}
   */
  async clone(path) {
    return (await this.options.driver.clone(path));
  };

  /**
   * Copy database.
   * @returns {Promise<Database>}
   */
  async copy() {
    const data = this.all();

    const options = { ...this.options };
    options.path = `${this.options.path}/${this.options.name}-copy.${this.options.driver.extension}`;

    const db = new this.constructor(options);
    for (const { key, value } of data) await db.set(key, value);

    return db;
  };

  /**
   * Concat databases.
   * @param {...Database} databases
   * @returns {Promise<Database>} New Concatted database.
   */
  async concat(...databases) {
    const db = this.copy();

    for (const database of databases) {
      if (!(database instanceof Database)) new DatabaseError({ message: `'${database}' is not valid hypr database.` });

      const data = database.all();
      for (const { key, value } of data) await db.set(key, value);
    };

    return db;
  };

  /**
   * Delete data from database.
   * @param {string} key 
   * @returns {Promise<boolean>}
   * @example db.del('hypr');
   */
  async del(key) {
    const parsed = await this.options.driver.unset(key, this.options.autoWrite);
    if (parsed) this.size--;

    return parsed;
  };

  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback 
   * @returns {boolean}
   */
  every(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (!callback(value, key, index, this)) return false;
    };

    return true;
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.exists('hypr');
   */
  exists(key) {
    return this.options.driver.has(key);
  };

  /**
   * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
   * @param {(value: any, key: string index: number, Database: this) => boolean} callback
   * @returns {Database}
   * @example db.filter((prop) => prop === '1.1');
   */
  filter(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const collected = new this.constructor(this.options);

    const data = this.all();

    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) collected.set(key, value);
    };

    return collected;
  };

  /**
   * Find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
   * @param {(value: any, index: number, Database: this) => boolean} callback 
   * @returns {boolean | any}
   * @example db.find((prop) => prop === '1.0');
   */
  find(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const data = this.array({ type: 'values' });

    for (let index = 0; (!collected && index < data.length); index++) {
      const value = data[index];

      if (callback(value, index, this)) return value;
    };

    return false;
  };

  /**
   * Find and update.
   * @param {any} newValue Value to update keys.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback 
   * @returns {void}
   */
  findUpdate(newValue, callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) this.update(key, newValue);
    };

    return void 0;
  };

  /**
   * Find and delete.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback 
   * @returns {boolean}
   */
  findDelete(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    let state;

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) state = this.del(key);
    };

    return state;
  };

  /**
   * Get data from database.
   * @param {string} key 
   * @returns {any}
   * @example db.get('hypr.version');
   */
  get(key) {
    return this.options.driver.get(key);
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.has('hypr');
   */
  has(key) {
    return this.exists(key);
  };

  /**
   * Set data to database.
   * @param {string} key 
   * @param {any} value 
   * @returns {Promise<any>}
   * @example db.set('hypr.version', '1.0.0');
   */
  async set(key, value) {
    if (this.options.size != 0 && (this.size > this.options.size)) new DatabaseError({ message: `Database limit exceeded.` });

    await this.options.driver.set(key, value, this.options.autoWrite);
    this.size++;

    return value;
  };

  /**
   * Subtract specified number of values to the specified key.
   * @param {string} key 
   * @param {number} amount
   * @param {boolean} negative
   * @returns {number}
   * @example db.sub('result', 5);
   */
  sub(key, amount = 1, negative = false) {
    return this.math(key, this.get(key), '-', amount, negative);
  };

  /**
   * Search in database.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback 
   * @returns {Array<{ key: string, value: any }>}
   * @example db.search((value, key, index) => key === 'hypr');
   */
  search(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const collected = [];

    const data = this.json();

    let index = 0;
    for (const key in data) {
      if (callback(data[key], key, index, this)) collected.push({ key, value: data[key] });

      index++;
    };

    return collected;
  };

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback
   * @returns {boolean}
   */
  some(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) return true;
    };

    return false;
  };

  /**
   * Convert database to json.
   * @returns {object}
   */
  json() {
    return this.options.driver.json();
  };

  /**
   * Get type of stored data in key.
   * @param {string} key
   * @returns {'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function' | 'NaN' | 'finite'}
   * @example db.type('hypr');
   */
  type(key) {
    const data = this.get(key);

    let __type;
    if (Array.isArray(data)) __type = 'array';
    else if (isNaN(data)) __type = 'NaN';
    else if (isFinite(data)) __type = 'finite';
    else __type = typeof data;

    return __type;
  };

  /**
   * Do Math operations easily!
   * @param {string} operator 
   * @param {number} count
   * @returns {number}
   * @example db.math('result', '/', 2);
   */
  async math(key, operator, count, negative = false) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof key });
    if (typeof operator != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof operator });
    if (typeof count != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof count });

    if (!this.exists(key)) await this.set(key, 0);

    const data = this.get(key);
    if (typeof data != 'number') new DatabaseError({ type: 'Validation', expected: 'number', received: typeof data });

    let result = data;
    if (operator === '+') result += count;
    else if (operator === '-') result -= count;
    else if (operator === '*') result *= count;
    else if (operator === '**') result **= count;
    else if (operator === '/') result /= count;
    else if (operator === '%') result %= count;

    if (!negative && result < 0) result = 0;

    return (await this.update(key, result));
  };

  /**
   * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback 
   * @returns {Promise<Database>}
   */
  async map(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const db = new this.constructor(this.options);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) await db.set(key, value);
    };

    return db;
  };

  /**
   * Push data to array.
   * @param {string} key 
   * @param  {...any} values 
   * @returns {Promise<void>}
   * @example db.push('versions', '1.0', '1.1');
   */
  async push(key, ...values) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof key });

    const data = this.get(key);
    if (!data) await this.set(key, values);

    if (Array.isArray(data)) {
      if (this.options.overWrite) await this.update(key, values);
      else await this.set(key, [...data, ...values]);
    } else await this.set(key, values);

    return void 0;
  };

  /**
   * Pulls data from array.
   * @param {string} key 
   * @param {(value: any, index: number, Database: this) => boolean} callback
   * @returns {Promise<Array<any>>}
   * @example db.pull('versions', (prop) => prop === '1.0'));
   */
  async pull(key, callback = () => { }) {
    if (typeof key != 'string') new DatabaseError({ type: 'Validation', expected: 'string', received: typeof key });
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    if (!this.exists(key)) return null;

    const data = this.get(key);

    if (!Array.isArray(data)) new DatabaseError({ type: 'Validation', expected: 'array', received: typeof data });

    let result = [];
    for (let index = 0; index < data.length; index++) {
      const value = data[index];

      if (!callback(value, index, this)) result.push(value);
    };

    return (await this.update(key, result));
  };

  /**
   * Database partitioning.
   * @param {(value: any, key: string, index: number, Database: this) => boolean} callback
   * @returns {Promise<Array<Database>>}
   */
  async partition(callback = () => { }) {
    if (typeof callback != 'function') new DatabaseError({ type: 'Validation', expected: 'function', received: typeof callback });

    const tables = [new this.constructor(this.options), new this.constructor(this.options)];

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) await tables[0].set(key, value);
      else await tables[1].set(key, value);
    };

    return tables;
  };

  /**
   * Update data from database.
   * @param {string} key 
   * @param {any} value 
   * @returns {Promise<any>}
   * @example db.update('key', 'newValue');
   */
  async update(key, value) {
    return (await this.options.driver.update(key, value));
  };

  /**
   * Database Drivers.
   * @type typeof Drivers
   */
  static Drivers = Drivers;

  /**
   * Database (hypr.db) version.
   * @type string
   * @readonly
   */
  static version = '5.1.0';
};