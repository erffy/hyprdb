import * as Drivers from "../drivers/index";
export default class Database<V extends DatabaseSignature<V> = DatabaseMap> {
	size: number;
	readonly options: DatabaseOptions;
	constructor(options?: DatabaseOptions);
	assign(
		other: any,
		options?: {
			callbackName?: string;
		}
	): Record<string, boolean>;
	at(
		keyIndex?: number,
		valueIndex?: number
	): {
		key: string;
		value: V;
	};
	all(amount?: number): Array<{
		key: string;
		value: V;
	}>;
	array(): {
		keys: string[];
		values: any[];
	};
	add(key: string, amount?: number, negative?: boolean): number;
	clone(path?: string): void;
	del(key: string): boolean;
	every(callback: Function): boolean;
	exists(key: string): boolean;
	filter(callback: Function): Database<V>;
	find(callback: Function): boolean | V;
	findUpdate(newValue: V, callback: Function): void;
	findDelete(callback: Function): boolean;
	get(key: string): V;
	has(key: string): boolean;
	set(key: string, value?: V): V | undefined;
	sub(key: string, amount?: number, negative?: boolean): number;
	search(callback: Function): Array<{
		key: string;
		value: V;
	}>;
	some(callback: Function): boolean;
	json(): object;
	type(key: string): string;
	math(
		key: string,
		operator: MathOperations,
		count: number,
		negative?: boolean
	): number;
	map(callback: Function): Database<V>;
	push(key: string, ...values: Array<V>): void;
	pull(key: string, callback: Function): V | undefined | null;
	ping(callback?: Function): PingResult;
	static concat(...databases: Array<Database>): Database;
	static readonly Drivers: typeof Drivers;
	static readonly version = "6.0.0";
}
/**
 * Database Options.
 * @interface
 */
interface DatabaseOptions {
	/**
	 * Database Name.
	 * @default hypr
	 */
	name?: string;
	/**
	 * Spaces. (Only JSON and JSON5)
	 * @default 2
	 */
	spaces?: number;
	/**
	 * Database Size.
	 * @default 0
	 */
	size: number;
	/**
	 * Database Overwrite. (Only 'push' method.)
	 * @default true
	 */
	overWrite?: boolean;
	/**
	 * Database Autowrite.
	 * @default true
	 */
	autoWrite?: boolean;
	/**
	 * Database Driver.
	 * @default JSONDriver
	 */
	driver: Drivers.Base;
}
interface PingResult {
	/**
	 * Driver name.
	 */
	from: string;
	/**
	 * set function speed.
	 */
	set: string;
	/**
	 * get function speed.
	 */
	get: string;
	/**
	 * del function speed.
	 */
	del: string;
	/**
	 * average speed.
	 */
	average: string;
}
interface DatabaseMap {
	[key: string]: any;
}
type DatabaseSignature<V> = {
	[key in keyof V]: any;
};
type MathOperations = "+" | "-" | "/" | "**" | "*" | "%";
export {};
//# sourceMappingURL=Database.d.ts.map
