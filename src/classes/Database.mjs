import { createRequire } from "node:module";

import _get from 'lodash.get';
import _has from 'lodash.has';
import _unset from 'lodash.unset';
import _set from 'lodash.set';

import DatabaseError from './DatabaseError.mjs';
import JSONDriver from '../structures/JSON.mjs';
import YAMLDriver from '../structures/YAML.mjs';
import BSONDriver from '../structures/BSON.mjs';

const pkg = ((createRequire(import.meta.url))('../../package.json'));

/**
 * Nova Database.
 * @class Database
 */
export default class Database {
  /**
   * Create new Database.
   * @param {import('../global').hypr.DatabaseOptions} options
   * @constructor
   */
  constructor(options = {}) {
    options.size ??= 0;
    options.overwrite ??= false;

    options.driver ??= new JSONDriver(options?.path);

    if (typeof options.size !== 'number') (new DatabaseError(`'${options.size}' is not Number.`, { name: 'TypeError' })).throw();
    if (typeof options.overwrite !== 'boolean') (new DatabaseError(`'${options.overwrite}' is not Boolean.`, { name: 'TypeError' })).throw();

    if (!(options.driver instanceof JSONDriver) && !(options.driver instanceof YAMLDriver) && !(options.driver instanceof BSONDriver)) (new DatabaseError(`'${options.driver}' is not valid Driver Instance.`, { name: 'DriverError' })).throw();
    
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

    /**
     * Database size.
     * @type number
     * @readonly
     */
    this.size = this.toArray().keys.length;
  };

  /**
   * Set data to database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.set('nova.version', '1.0.0');
   */
  set(key, value) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    if (this.options.size > 0 && (this.size >= this.options.size)) (new DatabaseError('Database limit exceeded.', { name: 'RangeError' })).throw();

    this.driver.set(key, value);
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
    if (typeof index !== 'number') (new DatabaseError(`'${index}' is not Number.`, { name: 'TypeError' })).throw();

    const data = this.toArray().values;

    if (index > data.length) (new DatabaseError('Value limit exceeded.', { name: 'RangeError' })).throw();

    return data[index];
  };

  /**
   * Get key with index.
   * @param {number} index 
   * @returns {string}
   * @example db.keyAt(2);
   */
  keyAt(index = 0) {
    if (typeof index !== 'number') (new DatabaseError(`'${index}' is not Number.`, { name: 'TypeError' })).throw();

    const data = this.toArray().keys;

    if (index > data.length) (new DatabaseError('Key limit exceeded.', { name: 'RangeError' })).throw();

    return data[index];
  };

  /**
   * Update data from database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.update('key', 'newValue');
   */
  update(key, value) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    return this.driver.update(key, value);
  };

  /**
   * Get data from database.
   * @param {string} key 
   * @returns {unknown}
   * @example db.get('nova.version');
   */
  get(key) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    return this.driver.get(key);
  };

  /**
   * Delete data from database.
   * @param {string} key 
   * @returns {boolean}
   * @example db.del('nova');
   */
  del(key) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    const parsed = this.driver.delete(key);

    if (parsed) this.size--;

    return parsed;
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.exists('nova');
   */
  exists(key) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    return this.driver.exists(key);
  };

  /**
   * Checks if path is a direct property of object.
   * @param {string} key 
   * @returns {boolean}
   * @example db.has('nova');
   */
  has(key) {
    return this.exists(key);
  };

  /**
   * Get all data from database.
   * @param {number} amount 
   * @returns {{ key: string, value: unknown }[]}
   * @example db.all();
   */
  all(amount = 0) {
    if (typeof amount !== 'number') (new DatabaseError(`'${amount}' is not Number.`, { name: 'TypeError' })).throw();

    const data = Object.keys(this.driver.cache);

    let results = [];
    for (const key of data) results.push({ key, value: this.driver.get(key) });

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
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof amount !== 'number') (new DatabaseError(`'${amount}' is not Number.`, { name: 'TypeError' })).throw();

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
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof amount !== 'number') (new DatabaseError(`'${amount}' is not Number.`, { name: 'TypeError' })).throw();

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
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof operator !== 'string') (new DatabaseError(`'${operator}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof numberOne !== 'number') (new DatabaseError(`'${numberOne}' is not Number.`, { name: 'TypeError' })).throw();
    if (typeof numberTwo !== 'number') (new DatabaseError(`'${numberTwo}' is not Number.`, { name: 'TypeError' })).throw();

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

    return this.update(key, result);
  };

  /**
   * Push data to array.
   * @param {string} key 
   * @param  {...unknown} values 
   * @returns {void}
   * @example db.push('versions', '1.0', '1.1');
   */
  push(key, ...values) {
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

    const data = this.get(key);
    if (!data) this.set(key, values);

    if (Array.isArray(data)) {
      if (this.options.overwrite) this.update(key, values);
      else this.set(key, [...data, ...values]);
    } else this.set(key, values);

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
    if (typeof key !== 'string') (new DatabaseError(`'${key}' is not String.`, { name: 'TypeError' })).throw();

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
    for (const prop of data) _set(obj, prop.key, prop.value);

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