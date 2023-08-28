import { DatabaseOptions } from './lib/interfaces/DatabaseOptions';
import { MathOperations } from './lib/interfaces/MathOperations';
import { PingResult } from './lib/interfaces/PingResult';
import { DriverOptions } from './lib/interfaces/DriverOptions';

/**
 * Hyper Database Module.
 */
declare module 'hypr.db' {
  // @ts-ignore
  export default class Database<V = any> {
    /**
     * Create new Database.
     * @param options Database options.
     * @constructor
     */
    public constructor(options?: DatabaseOptions);

    /**
     * Database options.
     */
    protected readonly options: DatabaseOptions;

    /**
     * Database driver.
     */
    protected readonly driver: Driver<V>;

    /**
     * Database size.
     */
    public readonly size: number;


    /**
     * Assign this database to other database.
     * @param other Database class.
     * @param options Assign options.
     */
    public assign(other: any, options?: { callbackName?: string }): Readonly<Record<string, boolean>>;

    /**
     * Get data with index.
     * @param keyIndex Key index.
     * @param valueIndex Value index.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array#at}
     */
    public at(keyIndex?: number, valueIndex?: number): { key: string, value: V };

    /**
     * Get all data from database.
     * @param amount Amount of data
     */
    public all(amount?: number): Array<{ key: string, value: V }>;

    /**
     * Convert database to array.
     */
    public array(): { keys: Array<string>, values: Array<V> };

    /**
     * Add specified number of values to the specified key.
     * @param key Key
     * @param amount Amount to add.
     * @param negative Set it to be negative.
     */
    public add(key: string, amount?: number, negative?: boolean): number;

    /**
     * Delete data from database.
     * @param key Key
     */
    public del(key: string): boolean;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callback
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array#every}
     */
    public every(callback?: (value: V, key: string, index: number, Database: this) => boolean): boolean;

    /**
     * Performs the specified action for each element in an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach Array#forEach}
     */
    public each(callback?: (value: V, key: string, index: number, Database: this) => any): void;

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public exists(key: string): boolean;

    /**
     * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
     * @param callback
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array#filter}
     */
    public filter(callback?: (value: V, key: string, index: number, Database: this) => boolean): Database<V>;

    /**
     * Find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array#find}
     */
    public find(callback?: (value: V, key: string, index: number, Database: this) => boolean): V | undefined;

    /**
     * Find the first value that satisfies the condition and update to new value.
     * @param value New value to replace.
     * @param callback
     */
    public findUpdate(value: V, callback?: (value: V, key: string, index: number, Database: this) => boolean): void;

    /**
     * Find the first value that satisfies the condition and delete it.
     * @param callback
     */
    public findDelete(callback?: (value: V, key: string, index: number, Database: this) => boolean): void;

    /**
     * Get data from database.
     * @param key Key
     */
    public get(key: string): V;

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public has(key: string): boolean;

    /**
     * Set data to database.
     * @param key Key
     * @param value Value
     */
    public set(key: string, value: V): V;

    /**
     * Subtraction in database over key.
     * @param key Key
     * @param amount Amount to subtract.
     * @param negative Set it to be negative.
     */
    public sub(key: string, amount?: number, negative?: boolean): number;

    /**
     * Search in database.
     * @param callback
     */
    public search(callback?: (value: V, key: string, index: number, Database: this) => boolean): Array<{ key: string, value: V }>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array#some}
     */
    public some(callback?: (value: V, key: string, index: number, Database: this) => boolean): boolean;

    /**
     * Convert database to json.
     */
    public json(): Record<string, V>;

    /**
     * Get data type of stored value in key.
     * @param key Key
     */
    public type(key: string): DataTypes;

    /**
     * Do math in easily.
     * @param key Key
     * @param operator Operator.
     * @param count Count.
     * @param negative Set it to be negative.
     */
    public math(key: string, operator: MathOperations, count: number, negative?: boolean): number;

    /**
     * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     */
    public map(callback?: (value: V, key: string, index: number, Database: this) => boolean): Database<V>;

    /**
     * Push values to array.
     * @param key Key
     * @param values Values to push.
     */
    public push(key: string, ...values: Array<V>): void;

    /**
     * Pulls data from array.
     * @param key Key
     * @param callback
     */
    public pull(key: string, callback?: (value: V, index: number, Database: this) => boolean): Array<V> | undefined;

    /**
     * Calculate database ping.
     * @param callback
     */
    public ping(callback?: (result: PingResult) => any): PingResult;

    /**
     * Concat databases.
     * @param databases Hypr databases to concat.
     */
    static concat<V = any>(databases: Array<Database<V>>, options: DriverOptions): Database<V>;

    /**
     * Database version.
     */
    static readonly version: string;
  }

  export { Database };

  export type DataTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function';

  class Driver<V = any> extends Map<string, V> {
    /**
     * Create new Database Driver.
     * @constructor
     */
    public constructor(options?: DriverOptions);

    protected readonly options: DriverOptions;

    public override set(key: string, value: V): V;
    public override get(key: string): V | undefined;
    public override has(key: string): boolean;
    public override delete(key: string): boolean;
    public array(): { keys: Array<string>, values: Array<V> };
    public json(): Record<string, V>;

    protected static encode(data: string): string;
    protected static decode(data: string): string;
    protected static set(object: Record<string, any>, path: string, value: any): Record<string, any>;
    protected static get(object: Record<string, any>, path: string): Record<string, any> | undefined;
    protected static has(object: Record<string, any>, path: string): boolean;
    protected static unset(object: Record<string, any>, path: string): boolean;
    protected static write(object: Record<string, any>, path: string): void;
    static checkOptions(options: DriverOptions): DriverOptions;

    /**
     * Save database.
     * @param data Data to save database file.
     */
    protected save(data?: Record<string, V>): void;

    /**
     * Read database and save to cache.
     */
    protected read(): void;
  }
}