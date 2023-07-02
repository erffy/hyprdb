"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _shapeshift = require("@sapphire/shapeshift");
var _gracefulFs = _interopRequireDefault(require("graceful-fs"));
var _yaml = _interopRequireDefault(require("yaml"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var YAMLProvider = /*#__PURE__*/function () {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   */
  function YAMLProvider() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "".concat(process.cwd(), "/database.yaml");
    _classCallCheck(this, YAMLProvider);
    _shapeshift.s.string.parse(path);
    if (!path.endsWith('.yaml')) path += '.yaml';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;
    if (!_gracefulFs["default"].existsSync(this.path)) _gracefulFs["default"].writeFileSync(this.path, _yaml["default"].stringify({}));
  }
  _createClass(YAMLProvider, [{
    key: "write",
    value:
    // JSON a düzgün çeviremiyordu yani
    /**
     * Write database file.
     * @param {unknown} data 
     * @returns {void}
     */
    function write() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _gracefulFs["default"].writeFileSync(this.path, _yaml["default"].stringify(data));
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
      var _YAML$parse;
      var data = this.read();
      return JSON.parse(JSON.stringify((_YAML$parse = _yaml["default"].parse(data)) !== null && _YAML$parse !== void 0 ? _YAML$parse : {}));
    }
  }]);
  return YAMLProvider;
}();
exports["default"] = YAMLProvider;
;