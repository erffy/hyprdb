"use strict";
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
		  }
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
		  });
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", { enumerable: true, value: v });
		  }
		: function (o, v) {
				o["default"] = v;
		  });
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
Object.defineProperty(exports, "__esModule", { value: true });
const Drivers = __importStar(require("../drivers/index"));
const __ping = (result) =>
	console.log(
		`[${result.from} [${result.average}]] set: ${result.set} | get: ${result.get} | del: ${result.del}`
	);
class Database {
	size;
	options;
	constructor(
		options = {
			driver: new Drivers.JSON(),
			size: 0,
			overWrite: false,
			autoWrite: true,
		}
	) {
		if (!(options.driver instanceof Drivers.Base))
			throw new TypeError(`'options.driver' is not valid driver.`);
		this.options = options;
		this.size = this.array().keys.length;
	}
	assign(other, options = {}) {
		if (!other?.constructor)
			throw new TypeError(`'other' must be an constructor.`);
		options.callbackName ??= "set";
		const obj = {};
		const data = this.json();
		for (const key in data) {
			if (typeof other[options.callbackName] != "function")
				throw new TypeError(
					`'other[options.callbackName]' must be an function.`
				);
			try {
				other[options.callbackName](key, data[key]);
				obj[key] = true;
			} catch (error) {
				throw new Error(`AssignError: ${error}`);
			}
		}
		return obj;
	}
	at(keyIndex, valueIndex) {
		keyIndex ??= 0;
		valueIndex ??= 0;
		const array = this.array();
		const key = array.keys[keyIndex];
		const value = array.values[valueIndex];
		return { key, value };
	}
	all(amount = 0) {
		const obj = this.json();
		let results = [];
		for (const key in obj) results.push({ key, value: obj[key] });
		if (amount > 0) results = results.splice(0, amount);
		return results;
	}
	array() {
		return this.options.driver.array();
	}
	add(key, amount = 1, negative = false) {
		return this.math(key, "+", amount, negative);
	}
	clone(path) {
		return this.options.driver.clone(path);
	}
	del(key) {
		const parsed = this.options.driver.unset(key, this.options.autoWrite);
		if (parsed) this.size--;
		return parsed;
	}
	every(callback) {
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (!callback(value, key, index, this)) return false;
		}
		return true;
	}
	exists(key) {
		return this.options.driver.has(key);
	}
	filter(callback) {
		const collected = new Database(this.options);
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) collected.set(key, value);
		}
		return collected;
	}
	find(callback) {
		let collected = false;
		const data = this.all();
		for (let index = 0; !collected && index < data.length; index++) {
			const { key, value } = data[index];
			collected = true;
			if (callback(value, key, index, this)) return value;
		}
		return false;
	}
	findUpdate(newValue, callback) {
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) this.set(key, newValue);
		}
		return void 0;
	}
	findDelete(callback) {
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) return this.del(key);
		}
		return false;
	}
	get(key) {
		return this.options.driver.get(key);
	}
	has(key) {
		return this.exists(key);
	}
	set(key, value) {
		if (this.options.size != 0 && this.size > this.options.size)
			throw new RangeError("Database limit exceeded.");
		this.options.driver.set(key, value, this.options.autoWrite);
		this.size++;
		return value;
	}
	sub(key, amount = 1, negative = false) {
		return this.math(key, "-", amount, negative);
	}
	search(callback) {
		const collected = [];
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) collected.push({ key, value });
		}
		return collected;
	}
	some(callback) {
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) return true;
		}
		return false;
	}
	json() {
		return this.options.driver.json();
	}
	type(key) {
		const data = this.get(key);
		let __type;
		if (Array.isArray(data)) __type = "array";
		else if (isNaN(data)) __type = "NaN";
		else if (isFinite(data)) __type = "finite";
		else __type = typeof data;
		return __type;
	}
	math(key, operator, count, negative = false) {
		// @ts-ignore
		if (!this.exists(key)) this.set(key, 0);
		const data = this.get(key);
		if (typeof data != "number")
			throw new TypeError(`'data' must be an number.`);
		let result = data;
		if (operator === "+") result += count;
		else if (operator === "-") result -= count;
		else if (operator === "*") result *= count;
		else if (operator === "**") result **= count;
		else if (operator === "/") result /= count;
		else if (operator === "%") result %= count;
		if (!negative && result < 0) result = 0;
		// @ts-ignore
		return this.set(key, result);
	}
	map(callback) {
		const db = new Database();
		const data = this.all();
		for (let index = 0; index < data.length; index++) {
			const { key, value } = data[index];
			if (callback(value, key, index, this)) db.set(key, value);
		}
		return db;
	}
	push(key, ...values) {
		const data = this.get(key);
		// @ts-ignore
		if (!data) this.set(key, values);
		if (Array.isArray(data)) {
			// @ts-ignore
			if (this.options.overWrite) this.set(key, values);
			// @ts-ignore
			else this.set(key, [...data, ...values]);
			// @ts-ignore
		} else this.set(key, values);
		return void 0;
	}
	pull(key, callback) {
		if (!this.exists(key)) return null;
		const data = this.get(key);
		if (!Array.isArray(data)) throw new TypeError(`'data' must be an array.`);
		let result = [];
		for (let index = 0; index < data.length; index++) {
			const value = data[index];
			if (!callback(value, index, this)) result.push(value);
		}
		// @ts-ignore
		return this.set(key, result);
	}
	ping(callback = __ping) {
		const version = Number(process.version.split("v")[0]);
		const runfn = version > 15 ? performance.now : Date.now;
		const random = Math.floor(Math.random() * 100).toString();
		const setStart = runfn();
		// @ts-ignore
		this.set(random, 0);
		const setEnd = runfn();
		const getStart = runfn();
		this.get(random);
		const getEnd = runfn();
		const delStart = runfn();
		this.del(random);
		const delEnd = runfn();
		let set = setEnd - setStart;
		let get = getEnd - getStart;
		let del = delEnd - delStart;
		let average = ((set + get + del) / 3).toFixed(2).concat("ms");
		set = set.toFixed(2).concat("ms");
		get = get.toFixed(2).concat("ms");
		del = del.toFixed(2).concat("ms");
		const results = {
			from: this.options.driver.constructor.name.split("Driver")[0],
			set,
			get,
			del,
			average,
		};
		callback(results);
		return results;
	}
	static concat(...databases) {
		const db = new Database(databases[0].options);
		for (const database of databases) {
			const data = database.all();
			for (const { key, value } of data) db.set(key, value);
		}
		return db;
	}
	static Drivers = Drivers;
	static version = "6.0.0";
}
exports.default = Database;
//# sourceMappingURL=Database.js.map
