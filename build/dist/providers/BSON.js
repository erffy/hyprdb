"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _shapeshift = require("@sapphire/shapeshift");
var _gracefulFs = _interopRequireDefault(require("graceful-fs"));
var BSON = _interopRequireWildcard(require("bson"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var BSONProvider = /*#__PURE__*/function () {
  /**
   * Create new Binary-Based database.
   * @param {string} path
   * @constructor 
   */
  function BSONProvider() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "".concat(process.cwd(), "/database.bson");
    _classCallCheck(this, BSONProvider);
    _shapeshift.s.string.parse(path);
    if (!path.endsWith('.bson')) path += '.bson';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;
    if (!_gracefulFs["default"].existsSync(this.path)) this.write({
      name: 'nova.db'
    });
  }
  _createClass(BSONProvider, [{
    key: "write",
    value:
    /**
     * Write database file.
     * @param {{}} data 
     * @returns {void}
     */
    function write(data) {
      _shapeshift.s.object(data).required;
      _gracefulFs["default"].writeFileSync(this.path, "".concat(BSON.serialize(data)), {
        encoding: 'binary'
      });
      return void 0;
    }
  }, {
    key: "read",
    value:
    /**
     * Read database file.
     * @returns {Buffer}
     */
    function read() {
      var data = _gracefulFs["default"].readFileSync(this.path);
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
      return BSON.deserialize(this.read());
    }
  }]);
  return BSONProvider;
}();
exports["default"] = BSONProvider;
;