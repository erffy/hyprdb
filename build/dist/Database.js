"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _shapeshift = require("@sapphire/shapeshift");
var _lodash = _interopRequireDefault(require("lodash"));
var _nodeModule = require("node:module");
var _JSON = _interopRequireDefault(require("./providers/JSON.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var pkg = (0, _nodeModule.createRequire)(import.meta.url)('../../package.json');

/**
 * Nova Database.
 * @class Database
 */
var Database = /*#__PURE__*/function () {
  /**
   * Create new Database.
   * @param {import('../global').novadatabase.DatabaseOptions} options
   * @constructor
   */
  function Database() {
    var _options$spaces, _options$size, _options$provider;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Database);
    /**
     * Database size.
     * @type number
     * @readonly
     */
    _defineProperty(this, "size", 0);
    (_options$spaces = options.spaces) !== null && _options$spaces !== void 0 ? _options$spaces : options.spaces = 2;
    (_options$size = options.size) !== null && _options$size !== void 0 ? _options$size : options.size = 0;
    (_options$provider = options.provider) !== null && _options$provider !== void 0 ? _options$provider : options.provider = new _JSON["default"](options === null || options === void 0 ? void 0 : options.path, options.spaces);
    _shapeshift.s.number.parse(options.spaces);
    _shapeshift.s.number.parse(options.size);

    /**
     * Database provider.
     * @type import('../global').novadatabase.AnyDatabaseProvider
     * @readonly
     */
    this.provider = options.provider;

    /**
     * Database options.
     * @type typeof options
     * @private
     */
    this.options = options;
  }
  _createClass(Database, [{
    key: "set",
    value:
    /**
     * Set data to database.
     * @param {string} key 
     * @param {unknown} value 
     * @returns {unknown}
     * @example db.set('nova.version', '1.0.0');
     */
    function set(key, value) {
      _shapeshift.s.string.parse(key);
      if (this.options.size > 0 && this.size >= this.options.size) throw new RangeError('Database limit exceeded.');
      var data = this.provider.toJSON();
      _lodash["default"].set(data, key, value);
      this.provider.write(data);
      this.size++;
      return value;
    }
  }, {
    key: "valueAt",
    value:
    /**
     * Get value with index.
     * @param {number} index 
     * @returns {unknown}
     * @example db.valueAt(1);
     */
    function valueAt() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      _shapeshift.s.number.parse(index);
      var data = this.toArray().values;
      if (index > data.length) throw new RangeError('Value limit exceeded.');
      var prop = data[index];
      return prop;
    }
  }, {
    key: "keyAt",
    value:
    /**
     * Get key with index.
     * @param {number} index 
     * @returns {string}
     * @example db.keyAt(2);
     */
    function keyAt() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      _shapeshift.s.number.parse(index);
      var data = this.toArray().keys;
      if (index > data.length) throw new RangeError('Key limit exceeded.');
      var prop = data[index];
      return prop;
    }
  }, {
    key: "update",
    value:
    /**
     * Update data from database.
     * @param {string} key 
     * @param {unknown} value 
     * @returns {unknown}
     * @example db.update('key', 'newValue');
     */
    function update(key, value) {
      _shapeshift.s.string.parse(key);
      if (!this.exists(key)) return this.set(key, value);
      this.del(key);
      this.set(key, value);
      return value;
    }
  }, {
    key: "get",
    value:
    /**
     * Get data from database.
     * @param {string} key 
     * @returns {unknown}
     * @example db.get('nova.version');
     */
    function get(key) {
      _shapeshift.s.string.parse(key);
      var data = this.provider.toJSON();
      var value = _lodash["default"].get(data, key);
      return value;
    }
  }, {
    key: "del",
    value:
    /**
     * Delete data from database.
     * @param {string} key 
     * @returns {boolean}
     * @example db.del('nova');
     */
    function del(key) {
      _shapeshift.s.string.parse(key);
      var data = this.provider.toJSON();
      var parsed = _lodash["default"].unset(data, key);
      this.provider.write(data);
      this.size--;
      return parsed;
    }
  }, {
    key: "exists",
    value:
    /**
     * Checks if path is a direct property of object.
     * @param {string} key 
     * @returns {boolean}
     * @example db.exists('nova');
     */
    function exists(key) {
      _shapeshift.s.string.parse(key);
      var data = this.provider.toJSON();
      var exists = _lodash["default"].has(data, key);
      return exists;
    }
  }, {
    key: "has",
    value:
    /**
     * Checks if path is a direct property of object.
     * @param {string} key 
     * @returns {boolean}
     * @example db.has('nova');
     */
    function has(key) {
      var exists = this.exists(key);
      return exists;
    }
  }, {
    key: "all",
    value:
    /**
     * Get all data from database.
     * @param {number} amount 
     * @returns {{ key: string, value: unknown }[]}
     * @example db.all();
     */
    function all() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      _shapeshift.s.number.parse(amount);
      var json = this.provider.toJSON();
      var data = Object.keys(json);
      var results = [];
      for (var _i = 0, _data = data; _i < _data.length; _i++) {
        var key = _data[_i];
        results.push({
          key: key,
          value: _lodash["default"].get(json, key)
        });
      }
      if (amount > 0) results = results.splice(0, amount);
      return results;
    }
  }, {
    key: "add",
    value:
    /**
     * Add specified number of values to the specified key.
     * @param {string} key 
     * @param {number} amount
     * @param {boolean} negative
     * @returns {number}
     * @example db.add('result', 3);
     */
    function add(key) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var negative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      _shapeshift.s.string.parse(key);
      _shapeshift.s.number.parse(amount);
      var data = this.get(key);
      if (typeof data !== 'number') throw new TypeError("'".concat(data, "' is not Number."));
      var math = this.math(data, '+', amount, negative);
      return math;
    }
  }, {
    key: "sub",
    value:
    /**
     * Subtract specified number of values to the specified key.
     * @param {string} key 
     * @param {number} amount
     * @param {boolean} negative
     * @returns {number}
     * @example db.sub('result', 5);
     */
    function sub(key) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var negative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      _shapeshift.s.string.parse(key);
      _shapeshift.s.number.parse(amount);
      var data = this.get(key);
      if (typeof data !== 'number') throw new TypeError("'".concat(data, "' is not Number."));
      var math = this.math(data, '-', amount, negative);
      return math;
    }
  }, {
    key: "math",
    value:
    /**
     * Do Math operations easily!
     * @param {number} numberOne 
     * @param {string} operator 
     * @param {number} numberTwo 
     * @returns {number}
     * @example db.math('result', 10, '/', 2);
     */
    function math(key, numberOne, operator, numberTwo) {
      var negative = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      _shapeshift.s.string.parse(key);
      _shapeshift.s.string.parse(operator);
      _shapeshift.s.number.parse(numberOne);
      _shapeshift.s.number.parse(numberTwo);
      if (!this.exists(key)) this.set(key, 0);
      var data = this.get(key);
      if (typeof data !== 'number') throw new TypeError("'".concat(data, "' is not Number."));
      var result = 0;
      if (operator === '+') result = numberOne + numberTwo;else if (operator === '-') result = numberOne - numberTwo;else if (operator === '*') result = numberOne * numberTwo;else if (operator === '**') result = Math.pow(numberOne, numberTwo);else if (operator === '/') result = numberOne / numberTwo;else if (operator === '%') result = numberOne % numberTwo;
      if (!negative && result < 1) result = 0;
      var parsed = this.update(key, result);
      return parsed;
    }
  }, {
    key: "push",
    value:
    /**
     * Push data to array.
     * @param {string} key 
     * @param  {...unknown} values 
     * @returns {void}
     * @example db.push('versions', '1.0', '1.1');
     */
    function push(key) {
      _shapeshift.s.string.parse(key);
      var data = this.get(key);
      for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }
      if (!data) this.set(key, values);
      if (Array.isArray(data)) this.update(key, values);else this.set(key, values);
      return void 0;
    }
  }, {
    key: "pull",
    value:
    /**
     * Pulls data from array.
     * @param {string} key 
     * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback
     * @returns {unknown[]}
     * @example db.pull('versions', (prop) => prop === '1.0'));
     */
    function pull(key) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var thisArg = arguments.length > 2 ? arguments[2] : undefined;
      _shapeshift.s.string.parse(key);
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (!this.exists(key)) return null;
      var data = this.get(key);
      if (!Array.isArray(data)) throw new TypeError("'".concat(data, "' is not Array."));
      if (thisArg) callback = callback.bind(thisArg);
      var result = [];
      for (var index = 0; index < data.length; index++) {
        if (!callback(data[index], index, data)) result.push(data[index]);
      }
      ;
      var parsed = this.update(key, result);
      return parsed;
    }
  }, {
    key: "toArray",
    value:
    /**
     * Convert database to array.
     * @returns {{ keys: string[], values: unknown[] }}
     * @example db.toArray();
     */
    function toArray() {
      var values = [];
      var keys = [];
      var data = this.all();
      var _iterator = _createForOfIteratorHelper(data),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var prop = _step.value;
          keys.push(prop.key);
          values.push(prop.value);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      ;
      return {
        keys: keys,
        values: values
      };
    }
  }, {
    key: "toJSON",
    value:
    /**
     * Convert database to object.
     * @returns {{}}
     * @example db.toJSON();
     */
    function toJSON() {
      var data = this.all();
      var obj = {};
      var _iterator2 = _createForOfIteratorHelper(data),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var prop = _step2.value;
          _lodash["default"].set(obj, prop.key, prop.value);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return obj;
    }
  }, {
    key: "filter",
    value:
    /**
     * A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback
     * @returns {unknown[]}
     * @example db.filter((prop) => prop === '1.1');
     */
    function filter() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var thisArg = arguments.length > 1 ? arguments[1] : undefined;
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (thisArg) callback = callback.bind(thisArg);
      var data = this.toArray().values;
      var array = [];
      for (var index = 0; index < data.length; index++) {
        if (callback(data[index], index, data)) array.push(data[index]);
      }
      ;
      return array;
    }
  }, {
    key: "find",
    value:
    /**
     * find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param {(value: unknown, index: number, array: unknown[]) => boolean} callback 
     * @returns {boolean | unknown}
     * @example db.find((prop) => prop === '1.0');
     */
    function find() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var thisArg = arguments.length > 1 ? arguments[1] : undefined;
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (thisArg) callback = callback.bind(thisArg);
      var data = this.toArray().values;
      var prop = false;
      for (var index = 0; index < data.length; index++) {
        if (prop) break;
        if (callback(data[index], index, data)) prop = data[index];
      }
      ;
      return prop;
    }
  }, {
    key: "findUpdate",
    value:
    /**
     * 
     * @param {unknown} value Value to update keys.
     * @param {(value: { key: string, value: unknown }, index: number, array: Array<{ key: string, value: unknown }>)} callback 
     * @returns {void}
     */
    function findUpdate(value) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var thisArg = arguments.length > 2 ? arguments[2] : undefined;
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (thisArg) callback = callback.bind(thisArg);
      var data = this.all();
      for (var index = 0; index < data.length; index++) {
        var prop = data[index];
        if (callback(prop, index, data)) this.update(prop.key, value);
      }
      ;
      return void 0;
    }
  }, {
    key: "findDelete",
    value:
    /**
     * 
     * @param {(value: { key: string, value: unknown }, index: number, array: Array<{ key: string, value: unknown }>)} callback 
     * @returns {void}
     */
    function findDelete() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var thisArg = arguments.length > 1 ? arguments[1] : undefined;
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (thisArg) callback = callback.bind(thisArg);
      var data = this.all();
      for (var index = 0; index < data.length; index++) {
        var prop = data[index];
        if (callback(prop, index, data)) this.del(prop.key);
      }
      ;
      return void 0;
    }
  }, {
    key: "map",
    value:
    /**
     * 
     * @param {(value: unknown, index: number, array: Array<unknown>)} callback 
     * @returns {void}
     */
    function map() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var thisArg = arguments.length > 1 ? arguments[1] : undefined;
      if (callback && typeof callback !== 'function') throw new TypeError("'".concat(callback, "' is not Function."));
      if (thisArg) callback = callback.bind(thisArg);
      var data = this.all();
      for (var index = 0; index < data.length; index++) callback(data[index].value, index, data);
      return void 0;
    }
  }, {
    key: "type",
    value:
    /**
     * Get type of stored data in key.
     * @param {string} key
     * @returns {"string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function" | "NaN" | "finite"}
     * @example db.type('nova');
     */
    function type(key) {
      var data = this.get(key);
      var __type;
      if (Array.isArray(data)) __type = 'array';else if (isNaN(data)) __type = 'NaN';else if (isFinite(data)) __type = 'finite';else __type = _typeof(data);
      return __type;
    }
  }]);
  return Database;
}();
exports["default"] = Database;
/**
 * Database (nova.db) version.
 * @type string
 * @readonly
 */
_defineProperty(Database, "version", pkg.version);
;