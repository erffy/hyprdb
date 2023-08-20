"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class JSONDriver extends Base_1.default {
	spaces;
	constructor(path, name, spaces = 2) {
		super(path, name, ".json");
		this.spaces = spaces;
		Base_1.default.write(this.path, JSON.stringify({}), "utf8");
		this.read();
	}
	clone(path) {
		return super.clone(path, JSON.stringify(this.json(), null, this.spaces));
	}
	save() {
		return super.save(JSON.stringify(this.json(), null, this.spaces));
	}
	read() {
		return super.read(JSON.parse, "utf8");
	}
}
exports.default = JSONDriver;
//# sourceMappingURL=JSON.js.map
