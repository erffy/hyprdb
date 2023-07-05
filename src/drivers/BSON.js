const fs = require('fs-extra');

const _set = require('lodash.set');
const _get = require('lodash.get');
const _unset = require('lodash.unset');
const _has = require('lodash.has');

const DatabaseError = require('../classes/DatabaseError');

module.exports = class BSONDriver {
  /**
   * Create new BSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.bson', spaces = 2) {
    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TypeError' })).throw();
    if (typeof spaces !== 'number') (new DatabaseError(`'${spaces}' is not Number.`, { name: 'TypeError' })).throw();

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.bson')) path += '.bson';

    /**
     * BSON Spaces.
     * @type typeof spaces
     * @private
     */
    this.spaces = spaces;

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    this.key = crypto.randomBytes(32);
    this.iv = crypto.randomBytes(16);

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
    fs.writeFileSync(this.path, BSONDriver.encode(JSON.stringify(this.cache, null, this.spaces)), 'binary');

    return;
  };

  /**
   * Read database file and save to cache.
   * @returns {void}
   */
  read() {
    const data = fs.readFileSync(this.path, { encoding: 'binary' });
    const decodedData = BSONDriver.decode(data);

    _merge(this.cache, decodedData);

    return void 0;
  };

  /**
   * Encode string to BSON binary.
   * @param {string} string
   * @returns {string} Encoded BSON data as binary string.
   * @static
   */
  static encode(string) {
    const encoder = new TextEncoder();
    const encodedBytes = encoder.encode(string);

    const buffer = new ArrayBuffer(encodedBytes.length + 4);
    const view = new Uint8Array(buffer);

    view[0] = encodedBytes.length & 0xff;
    view[1] = (encodedBytes.length >> 8) & 0xff;
    view[2] = (encodedBytes.length >> 16) & 0xff;
    view[3] = (encodedBytes.length >> 24) & 0xff;

    for (let i = 0; i < encodedBytes.length; i++) view[i + 4] = encodedBytes[i];

    let binary = '';

    for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);

    return binary;
  };

  /**
   * Decode BSON binary data to object.
   * @param {string} binary Binary data string.
   * @returns {object} Decoded object from BSON data.
   * @static
   */
  static decode(binary) {
    const byteLength = binary.length;
    const view = new Uint8Array(byteLength);

    for (let i = 0; i < byteLength; i++) view[i] = binary.charCodeAt(i);

    const length = (view[0] & 0xff) | ((view[1] & 0xff) << 8) | ((view[2] & 0xff) << 16) | ((view[3] & 0xff) << 24);

    const decoder = new TextDecoder();
    const decodedString = decoder.decode(view.subarray(4, 4 + length));

    return JSON.parse(decodedString);
  };
};