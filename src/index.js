"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drivers = exports.Database = void 0;
const Database_1 = __importDefault(require("./database/Database"));
exports.Database = Database_1.default;
const { Drivers } = Database_1.default;
exports.Drivers = Drivers;
exports.default = Database_1.default;
//# sourceMappingURL=index.js.map
