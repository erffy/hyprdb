const { s } = require('@sapphire/shapeshift');
const lodash = require('lodash');

const JSONProvider = require('../structures/JSON');

const pkg = require('../../package.json');

/**
 * Nova Database.
 * @class Database
 */
module.exports = class Database {
  /**
   * Create new Database.
   * @param {import('../global').hypr.DatabaseOptions} options
   * @constructor
   */
  constructor(options = {}) {
    options.spaces ??= 2;
    options.size ??= 0;

    options.driver ??= new JSONDriver(options?.path, options.spaces);

    if (typeof options.spaces !== 'number') (new DatabaseError(`'${options.spaces}' is not Number.`, { name: 'TypeError' })).throw();
    if (typeof options.size !== 'number') (new DatabaseError(`'${options.size}' is not Number.`, { name: 'TypeError' })).throw();

    /**
     * Database driver.
     * @type import('../global').hypr.AnyDatabaseDriver
     * @readonly
     */
    this.driver = options.driver;

    /**
     * Database options.
     * @type typeof options
     * @private
     */
    this.options = options;
  };

  /**
   * Database size.
   * @type number
   * @readonly
   */
  size = 0;

  /**
   * Set data to database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.set('nova.version', '1.0.0');
   */
  set(key, value) {
    s.string.parse(key);

    if (this.options.size > 0 && (this.size >= this.options.size)) (new DatabaseError('Database limit exceeded.', { name: 'RangeError' })).throw();

    lodash.set(this.driver.cache, key, value);

    this.driver.write();

    this.size++;

    return value;
  };

  /**
   * Get value with index.
   * @param {number} index 
   * @returns {unknown}
   * @example db.valueAt(1);
   */
  valueAt(index = 0) {
    s.number.parse(index);

    const data = this.toArray().values;

    if (index > data.length) (new DatabaseError('Value limit exceeded.', { name: 'RangeError' })).throw();

    const prop = data.at(index);

    return prop;
  };

  /**
   * Get key with index.
   * @param {number} index 
   * @returns {string}
   * @example db.keyAt(2);
   */
  keyAt(index = 0) {
    s.number.parse(index);

    const data = this.toArray().keys;

    if (index > data.length) (new DatabaseError('Key limit exceeded.', { name: 'RangeError' })).throw();

    const prop = data.at(index);

    return prop;
  };

  /**
   * Update data from database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.update('key', 'newValue');
   */
  update(key, value) {
    s.string.parse(key);

    if (!this.exists(key)) return this.set(key, value);

    this.del(key);
    this.set(key, value);

    return value;
  };

  /**
   * Get data from database.
   * @param {string} key 
   * @returns {unknown}
   * @example db.get('nova.version');
   */
  get(key) {
    s.string.parse(key);

    const value = lodash.get(this.driver.cache, key);

    return value;
  };

  /**
   * Delete data from database.
   * @param {string} key 
   * @returns {boolean}
   * @example db.del('nova');
   */
  del(key) {
    s.string.parse(key);

    const parsed = lodash.unset(this.driver.cache, key);

    this.driver.write();

    this.size--;

    return parsed;
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.exists('nova');
   */
  exists(key) {
    s.string.parse(key);

    const exists = lodash.has(this.driver.cache, key);

    return exists;
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.has('nova');
   */
  has(key) {
    const exists = this.exists(key);
    return exists;
  };

  /**
   * Get all data from database.
   * @param {number} amount 
   * @returns {{ key: string, value: unknown }[]}
   * @example db.all();
   */
  all(amount = 0) {
    s.number.parse(amount);

    const data = Object.keys(this.driver.cache);

    let results = [];
    for (const key of data) results.push({ key, value: lodash.get(this.driver.cache, key) });

    if (amount > 0) results = results.splice(0, amount);

    return results;
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
    s.string.parse(key);
    s.number.parse(amount);

    const data = this.get(key);
    if (typeof data !== 'number') (new DatabaseError(`'${data}' is not Number.`, { name: 'TypeError' })).throw();

    const math = this.math(data, '+', amount, negative);

    return math;
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
    s.string.parse(key);
    s.number.parse(amount);

    const data = this.get(key);
    if (typeof data !== 'number') (new DatabaseError(`'${data}' is not Number.`, { name: 'TypeError' })).throw();

    const math = this.math(data, '-', amount, negative);

    return math;
  };

  /**
   * Do Math operations easily!
   * @param {number} numberOne 
   * @param {string} operator 
   * @param {number} numberTwo 
   * @returns {number}
   * @example db.math('result', 10, '/', 2);
   */
  math(key, numberOne, operator, numberTwo, negative = false) {
    s.string.parse(key);
    s.string.parse(operator);
    s.number.parse(numberOne);
    s.number.parse(numberTwo);

    if (!this.exists(key)) this.set(key, 0);

    const data = this.get(key);
    if (typeof data !== 'number') (new DatabaseError(`'${data}' is not Number.`, { name: 'TypeError' })).throw();

    let result = 0;
    if (operator === '+') result = numberOne + numberTwo;
    else if (operator === '-') result = numberOne - numberTwo;
    else if (operator === '*') result = numberOne * numberTwo;
    else if (operator === '**') result = numberOne ** numberTwo;
    else if (operator === '/') result = numberOne / numberTwo;
    else if (operator === '%') result = numberOne % numberTwo;

    if (!negative && result < 1) result = 0;

    let parsed = this.update(key, result);

    return parsed;
  };

  /**
   * Push data to array.
   * @param {string} key 
   * @param  {...unknown} values 
   * @returns {void}
   * @example db.push('versions', '1.0', '1.1');
   */
  push(key, ...values) {
    s.string.parse(key);

    const data = this.get(key);
    if (!data) this.set(key, values);

    if (Array.isArray(data)) this.update(key, values);
    else this.set(key, values);

    return void 0;
  };

  /**
   * Pulls data from array.
   * @param {string} key 
   * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback
   * @returns {unknown[]}
   * @example db.pull('versions', (prop) => prop === '1.0'));
   */
  pull(key, callback = () => { }, thisArg) {
    s.string.parse(key);

    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (!this.exists(key)) return null;

    const data = this.get(key);

    if (!Array.isArray(data)) (new DatabaseError(`'${data}' is not Array.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    let result = [];
    for (let index = 0; index < data.length; index++) {
      if (!callback(data[index], index, data)) result.push(data[index]);
    };

    let parsed = this.update(key, result);

    return parsed;
  };

  /**
   * Convert database to array.
   * @returns {{ keys: string[], values: unknown[] }}
   * @example db.toArray();
   */
  toArray() {
    const values = [];
    const keys = [];

    const data = this.all();
    for (const prop of data) {
      keys.push(prop.key);
      values.push(prop.value);
    };

    return { keys, values };
  };

  /**
   * Convert database to object.
   * @returns {{}}
   * @example db.toJSON();
   */
  toJSON() {
    const data = this.all();

    const obj = {};
    for (const prop of data) lodash.set(obj, prop.key, prop.value);

    return obj;
  };

  /**
   * A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback
   * @returns {unknown[]}
   * @example db.filter((prop) => prop === '1.1');
   */
  filter(callback = () => { }, thisArg) {
    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    const data = this.toArray().values;
    let array = [];
    for (let index = 0; index < data.length; index++) {
      if (callback(data[index], index, data)) array.push(data[index]);
    };

    return array;
  };

  /**
   * find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
   * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback 
   * @returns {boolean | unknown}
   * @example db.find((prop) => prop === '1.0');
   */
  find(callback = () => { }, thisArg) {
    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    const data = this.toArray().values;

    let prop = false;
    for (let index = 0; index < data.length; index++) {
      if (prop) break;

      if (callback(data[index], index, data)) prop = data[index];
    };

    return prop;
  };

  /**
   * 
   * @param {unknown} value Value to update keys.
   * @param {(value: { key: string, value: unknown }, index: number, array: Array<{ key: string, value: unknown }>)} callback 
   * @returns {void}
   */
  findUpdate(value, callback = () => { }, thisArg) {
    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      let prop = data[index];

      if (callback(prop, index, data)) this.update(prop.key, value);
    };

    return void 0;
  };

  /**
   * 
   * @param {(value: { key: string, value: unknown }, index: number, array: Array<{ key: string, value: unknown }>)} callback 
   * @returns {void}
   */
  findDelete(callback = () => { }, thisArg) {
    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      let prop = data[index];

      if (callback(prop, index, data)) this.del(prop.key);
    };

    return void 0;
  };

  /**
   * 
   * @param {(value: unknown, index: number, array: Array<unknown>)} callback 
   * @returns {void}
   */
  map(callback = () => { }, thisArg) {
    if (callback && typeof callback !== 'function') (new DatabaseError(`'${callback}' is not Function.`, { name: 'TypeError' })).throw();

    if (thisArg) callback = callback.bind(thisArg);

    const data = this.all();
    for (let index = 0; index < data.length; index++) callback(data[index].value, index, data);

    return void 0;
  };

  /**
   * Get type of stored data in key.
   * @param {string} key
   * @returns {"string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function" | "NaN" | "finite"}
   * @example db.type('nova');
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
   * Database (nova.db) version.
   * @type string
   * @readonly
   */
  static version = pkg.version;
};