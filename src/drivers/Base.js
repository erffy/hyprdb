"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
class BaseDriver extends Map {
	/**
	 * Database Path.
	 */
	path;
	/**
	 * Database Name.
	 */
	name;
	/**
	 * Database Extension.
	 */
	extension;
	constructor(path = process.cwd(), name = "hypr", extension) {
		const platform = (0, node_os_1.platform)();
		super();
		const __path = path.substring(
			0,
			path.lastIndexOf(platform != "win32" ? "/" : "\\")
		);
		if (!(0, node_fs_1.existsSync)(__path))
			(0, node_fs_1.mkdirSync)(__path, { recursive: true });
		if (name) path += platform != "win32" ? `/${name}` : `\\${name}`;
		if (!extension.startsWith(".")) extension = `.${extension}`;
		if (!path.endsWith(extension)) path += extension;
		this.path = path;
		this.name = name;
		this.extension = extension;
	}
	set(key, value, autoWrite = true) {
		super.set(key, value);
		if (autoWrite) this.save();
		return value;
	}
	get(key) {
		return super.get(key);
	}
	has(key) {
		return super.has(key);
	}
	unset(key, autoWrite = true) {
		const state = this.delete(key);
		if (autoWrite) this.save();
		return state;
	}
	clone(path = `${this.path}-clone${this.extension}`, bind, encoding) {
		if (path.length < 1) throw new RangeError(`'${path}' is not valid path.`);
		const __path = path.substring(0, path.lastIndexOf("/"));
		if (__path.length > 0 && !(0, node_fs_1.existsSync)(__path))
			(0, node_fs_1.mkdirSync)(__path, { recursive: true });
		return (0, node_fs_1.writeFileSync)(path, bind, { encoding });
	}
	save(data, encoding) {
		return (0, node_fs_1.writeFileSync)(this.path, Buffer.from(data), {
			encoding,
		});
	}
	read(handler, encoding) {
		let data = (0, node_fs_1.readFileSync)(this.path, { encoding });
		data ??= "{}";
		const handled = handler(data);
		for (const key in handled) super.set(key, handled[key]);
		return void 0;
	}
	json() {
		const obj = {};
		for (const [key, value] of this) BaseDriver.set(obj, key, value);
		return obj;
	}
	array() {
		const data = this.json();
		const array = [[], []];
		for (const key in data) {
			array[0].push(key);
			array[1].push(data[key]);
		}
		return { keys: array[0], values: array[1] };
	}
	static set(object, path, value) {
		const keys = path.split(".");
		for (let index = 0; index < keys.length - 1; index++) {
			const key = keys[index];
			if (!object[key]) object[key] = {};
			object = object[key];
		}
		object[keys[keys.length - 1]] = value;
		return object;
	}
	static get(object, path) {
		const keys = path.split(".");
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (object[key]) object = object[key];
			else return undefined;
		}
		return object;
	}
	static has(object, path) {
		const keys = path.split(".");
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			if (object[key]) object = object[key];
			else return false;
		}
		return true;
	}
	static merge(object, source) {
		for (const key in source) {
			// @ts-ignore
			if (typeof source[key] === "object" && typeof object[key] === "object")
				BaseDriver.merge(object[key], source[key]);
			// @ts-ignore
			else object[key] = source[key];
		}
		return object;
	}
	static unset(object, path) {
		const keys = path.split(".");
		for (let index = 0; index < keys.length - 1; index++) {
			const key = keys[index];
			if (!object[key]) return false;
			object = object[key];
		}
		delete object[keys[keys.length - 1]];
		return true;
	}
	static write(path, data, encoding) {
		if ((0, node_fs_1.existsSync)(path)) return void 0;
		else return (0, node_fs_1.writeFileSync)(path, data, { encoding });
	}
}
exports.default = BaseDriver;
//# sourceMappingURL=Base.js.map
