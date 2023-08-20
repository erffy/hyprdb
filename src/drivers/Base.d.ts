/// <reference types="node" />
export default class BaseDriver extends Map {
	/**
	 * Database Path.
	 */
	readonly path: string;
	/**
	 * Database Name.
	 */
	readonly name: string;
	/**
	 * Database Extension.
	 */
	readonly extension: string;
	constructor(
		path: string | undefined,
		name: string | undefined,
		extension: string
	);
	set(key: string, value: any, autoWrite?: boolean): any;
	get(key: string): any;
	has(key: string): boolean;
	unset(key: string, autoWrite?: boolean): boolean;
	clone(path?: string, bind?: any, encoding?: BufferEncoding): void;
	save(data?: any, encoding?: BufferEncoding): void;
	read(
		handler: (data: any) => Record<string, any>,
		encoding?: BufferEncoding
	): void;
	json(): object;
	array(): {
		keys: Array<string>;
		values: Array<any>;
	};
	static set(object: Record<string, any>, path: string, value?: any): object;
	static get(object: Record<string, any>, path: string): object | undefined;
	static has(object: Record<string, any>, path: string): boolean;
	static merge(
		object: Record<string, any>,
		source: object
	): Record<string, any>;
	static unset(object: Record<string, any>, path: string): boolean;
	static write(path: string, data?: any, encoding?: BufferEncoding): void;
}
//# sourceMappingURL=Base.d.ts.map
