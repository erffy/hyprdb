"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _shapeshift = require("@sapphire/shapeshift");
var _gracefulFs = _interopRequireDefault(require("graceful-fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var JSONProvider = /*#__PURE__*/function () {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  function JSONProvider() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "".concat(process.cwd(), "/database.json");
    var spaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    _classCallCheck(this, JSONProvider);
    _shapeshift.s.string.parse(path);
    _shapeshift.s.number.parse(spaces);
    if (!path.endsWith('.json')) path += '.json';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    /**
     * @type typeof spaces
     * @private
     */
    this.spaces = spaces;
    if (!_gracefulFs["default"].existsSync(this.path)) _gracefulFs["default"].writeFileSync(this.path, JSON.stringify({}));
  }
  _createClass(JSONProvider, [{
    key: "write",
    value:
    /**
     * Write database file.
     * @param {{}} data 
     * @returns {void}
     */
    function write(data) {
      _shapeshift.s.object(data).required;
      var parsed = JSON.stringify(data, null, this.spaces);
      _gracefulFs["default"].writeFileSync(this.path, parsed);
      return void 0;
    }
  }, {
    key: "read",
    value:
    /**
     * Read database file.
     * @returns {string}
     */
    function read() {
      var data = _gracefulFs["default"].readFileSync(this.path, {
        encoding: 'utf8'
      });
      return data;
    }
  }, {
    key: "toJSON",
    value:
    /**
     * Convert database file to Object.
     * @returns {{}}
     */
    function toJSON() {
      return JSON.parse(this.read());
    }
  }]);
  return JSONProvider;
}();
exports["default"] = JSONProvider;
;