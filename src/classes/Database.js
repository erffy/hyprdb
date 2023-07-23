const DatabaseError = require('../classes/DatabaseError');

const BaseDriver = require('./drivers/BASE');
const JSONDriver = require('./drivers/JSON');
const HJSONDriver = require('./drivers/HJSON');
const YAMLDriver = require('./drivers/YAML');
const BSONDriver = require('./drivers/BSON');
const TOMLDriver = require('./drivers/TOML');
const JSON5Driver = require('./drivers/JSON5');
const INIDriver = require('./drivers/INI');
const CSVDriver = require('./drivers/CSV');
const CSONDriver = require('./drivers/CSON');

const pkg = require('../../package.json');

/**
 * Hyper Database.
 * @class Database
 */
module.exports = class Database {
  /**
   * Create new Database.
   * @param {DatabaseOptions} options
   * @constructor
   */
  constructor(options = {}) {
    options.size ??= 0;
    options.spaces ??= 2;
    options.overwrite ??= false;

    if (typeof options.size != 'number') throw new DatabaseError(`'${options.size}' is not number.`, { name: 'TypeError' });
    if (typeof options.overwrite != 'boolean') throw new DatabaseError(`'${options.overwrite}' is not Boolean.`, { name: 'TypeError' });
    if (typeof options.spaces != 'number') throw new DatabaseError(`'${options.spaces}' is not number.`, { name: 'TypeError' });

    options.driver ??= new JSONDriver(options?.path, options?.name, options.spaces);
    if (!(options.driver instanceof BaseDriver)) throw new DatabaseError(`'${options.driver}' is not valid Driver Instance.`, { name: 'DriverError' });

    /**
     * Database Options.
     * @type typeof options
     * @private
     */
    this.options = options;

    /**
     * Database driver.
     * @type AnyDatabaseDriver
     * @readonly
     */
    this.driver = this.options.driver;

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
   * @returns {object}
   */
  assign(other, options = {}) {
    if (typeof options != 'object') throw new DatabaseError(`'${options}' is not object.`, { name: 'TypeError' });
    if (!other?.constructor) throw new DatabaseError(`'${other}' is not constructor.`, { name: 'InvalidInstance' });

    options.callbackName ??= 'set';

    const obj = {};

    const data = this.json();
    for (const key in data) {
      if (typeof other[options.callbackName] != 'function') throw new DatabaseError(`'${options.callbackName}' is not function.`, { name: 'TypeError' });

      other[options.callbackName](key, data[key]);
      obj[key] = true;
    };

    return obj;
  };

  /**
   * Get key or value with index.
   * @param {number} keyIndex 
   * @param {number} valueIndex 
   * @returns {string | unknown | { key: string, value: unknown }}
   * @example db.at(0, 1); db.at(null, 0); db.at(1, null);
   */
  at(keyIndex = 0, valueIndex = 0) {
    if (typeof keyIndex != 'undefined' && typeof keyIndex != 'number') throw new DatabaseError(`'${keyIndex}' is not Number or Undefined.`, { name: 'TypeError' });
    if (typeof valueIndex != 'undefined' && typeof valueIndex != 'number') throw new DatabaseError(`'${valueIndex}' is not Number or Undefined.`, { name: 'TypeError' });

    if (typeof keyIndex === 'number') return ((this.array({ type: 'keys' }))[keyIndex]);
    else if (typeof valueIndex === 'number') return ((this.array({ type: 'values' }))[valueIndex]);

    const { keys, values } = this.array();

    return { key: keys[keyIndex], value: values[valueIndex] };
  };

  /**
   * Get all data from database.
   * @param {number} amount 
   * @returns {Array<{ key: string, value: unknown }>}
   * @example db.all();
   */
  all(amount = 0) {
    if (typeof amount != 'number') throw new DatabaseError(`'${amount}' is not number.`, { name: 'TypeError' });

    const obj = this.json();

    let results = [];
    for (const key in obj) results.push({ key, value: obj[key] });

    if (amount > 0) results = results.splice(0, amount);

    return results;
  };

  /**
   * Convert database to array.
   * @param {{ type?: 'all' | 'keys' | 'values' }} options
   * @returns {Array<string> | Array<unknown> | { keys: Array<string>, values: Array<unknown> } | void}
   * @example db.array(); db.array({ type: 'keys' }); db.array({ type: 'values' });
   */
  array(options) {
    return this.driver.array(options);
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
   * @returns {void}
   * @ignore
   */
  clone(path) {
    return this.driver.clone(path);
  };

  /**
   * Copy database.
   * @returns {Database}
   */
  copy() {
    const data = this.all();

    const options = { ...this.options };
    options.path = `${this.options.path}/${this.options.name}-copy.${this.options.driver.extension}`;

    const db = new this.constructor(options);
    for (const { key, value } of data) db.set(key, value);

    return db;
  };

  /**
   * Concat databases.
   * @param {...Database} databases
   * @returns {Database} New Concatted database.
   */
  concat(...databases) {
    const db = this.copy();

    for (const database of databases) {
      if (!(database instanceof Database)) throw new DatabaseError(`'${database}' is not valid database.`, { name: 'UnknownInstance' });

      const data = database.all();
      for (const { key, value } of data) db.set(key, value);
    };

    return db;
  };

  /**
   * Delete data from database.
   * @param {string} key 
   * @returns {boolean}
   * @example db.del('hypr');
   */
  del(key) {
    const parsed = this.driver.unset(key);
    if (parsed) this.size--;

    return parsed;
  };

  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param {(value: unknown, key: string, index: number, Database: this) => boolean} callback 
   * @returns {boolean}
   */
  every(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

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
    return this.driver.has(key);
  };

  /**
   * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
   * @param {(value: unknown, index: number, Database: this) => boolean} callback
   * @returns {Array<unknown>}
   * @example db.filter((prop) => prop === '1.1');
   */
  filter(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

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
   * @param {(value: unknown, index: number, Database: this) => boolean} callback 
   * @returns {boolean | unknown}
   * @example db.find((prop) => prop === '1.0');
   */
  find(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    const data = this.array({ type: 'values' });

    let collected = false;
    for (let index = 0; (!collected && index < data.length); index++) {
      const value = data[index];

      if (callback(value, index, this)) collected = value;
    };

    return collected;
  };

  /**
   * Find and update.
   * @param {unknown} newValue Value to update keys.
   * @param {(value: unknown, key: string, index: number, array: Array<{ key: string, value: unknown }>)} callback 
   * @returns {void}
   */
  findUpdate(newValue, callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) this.update(key, newValue);
    };

    return void 0;
  };

  /**
   * Find and delete.
   * @param {(value: unknown, key: string, index: number, array: Array<{ key: string, value: unknown }>)} callback 
   * @returns {boolean}
   */
  findDelete(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

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
   * @returns {unknown}
   * @example db.get('hypr.version');
   */
  get(key) {
    return this.driver.get(key);
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
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.set('hypr.version', '1.0.0');
   */
  set(key, value) {
    if (this.options.size != 0 && (this.size > this.options.size)) throw new DatabaseError('Database limit exceeded.', { name: 'RangeError' });

    this.driver.set(key, value);
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
   * @param {(value: unknown, key: string, index: number, Database: this) => boolean} callback 
   * @returns {{ key: string, value: unknown }[]}
   * @example db.search((value, key, index) => key === 'hypr');
   */
  search(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    const collected = [];

    const data = this.driver.json();

    let index = 0;
    for (const key in data) {
      if (callback(data[key], key, index, this)) collected.push({ key, value: data[key] });

      index++;
    };

    return collected;
  };

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param {(value: unknown, key: string, index: number, Database: this) => boolean} callback
   * @returns {boolean}
   */
  some(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

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
    return this.driver.json();
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
  math(key, operator, count, negative = false) {
    if (typeof key != 'string') throw new DatabaseError(`'${key}' is not string.`, { name: 'TypeError' });
    if (typeof operator != 'string') throw new DatabaseError(`'${operator}' is not string.`, { name: 'TypeError' });
    if (typeof count != 'number') throw new DatabaseError(`'${count}' is not number.`, { name: 'TypeError' });

    if (!this.exists(key)) this.set(key, 0);

    const data = this.get(key);
    if (typeof data != 'number') throw new DatabaseError(`'${data}' is not number.`, { name: 'TypeError' });

    let result = data;
    if (operator === '+') result += count;
    else if (operator === '-') result -= count;
    else if (operator === '*') result *= count;
    else if (operator === '**') result **= count;
    else if (operator === '/') result /= count;
    else if (operator === '%') result %= count;

    if (!negative && result < 0) result = 0;

    return this.update(key, result);
  };

  /**
   * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param {(value: unknown, key: string, index: number, Database: this) => unknown} callback 
   * @returns {Database}
   */
  map(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    const db = new this.constructor(this.options);

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  /**
   * Push data to array.
   * @param {string} key 
   * @param  {...unknown} values 
   * @returns {void}
   * @example db.push('versions', '1.0', '1.1');
   */
  push(key, ...values) {
    if (typeof key != 'string') throw new DatabaseError(`'${key}' is not string.`, { name: 'TypeError' });

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
   * @param {(value: unknown, index: number, Database: this) => boolean} callback
   * @returns {Array<unknown>}
   * @example db.pull('versions', (prop) => prop === '1.0'));
   */
  pull(key, callback = () => { }) {
    if (typeof key != 'string') throw new DatabaseError(`'${key}' is not string.`, { name: 'TypeError' });
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    if (!this.exists(key)) return null;

    const data = this.get(key);

    if (!Array.isArray(data)) throw new DatabaseError(`'${data}' is not array.`, { name: 'TypeError' });

    let result = [];
    for (let index = 0; index < data.length; index++) {
      const value = data[index];

      if (!callback(value, index, this)) result.push(value);
    };

    return this.update(key, result);
  };

  /**
   * Database partitioning.
   * @param {(value: unknown, key: string, index: number, Database: this) => boolean} callback
   * @returns {Array<Database>}
   */
  partition(callback = () => { }) {
    if (typeof callback != 'function') throw new DatabaseError(`'${callback}' is not function.`, { name: 'TypeError' });

    const tables = [new this.constructor(this.options), new this.constructor(this.options)];

    const data = this.all();
    for (let index = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) tables[0].set(key, value);
      else tables[1].set(key, value);
    };

    return tables;
  };

  /**
   * Update data from database.
   * @param {string} key 
   * @param {unknown} value 
   * @returns {unknown}
   * @example db.update('key', 'newValue');
   */
  update(key, value) {
    return this.driver.update(key, value);
  };

  /**
   * Database Drivers.
   */
  static Drivers = {
    /**
     * Driver.
     */
    Driver: BaseDriver,

    /**
     * BSON Driver.
     */
    BSON: BSONDriver,

    /**
     * YAML Driver.
     */
    YAML: YAMLDriver,

    /**
     * JSON Driver.
     */
    JSON: JSONDriver,

    /**
     * TOML Driver.
     */
    TOML: TOMLDriver,

    /**
     * HJSON Driver.
     */
    HJSON: HJSONDriver,

    /**
     * JSON5 Driver.
     */
    JSON5: JSON5Driver,

    /**
     * INI Driver.
     */
    INI: INIDriver,

    /**
     * CSV Driver.
     */
    CSV: CSVDriver,

    /**
     * CSON Driver.
     */
    CSON: CSONDriver
  };

  /**
   * Database (hypr.db) version.
   * @type string
   * @readonly
   */
  static version = pkg.version;
};