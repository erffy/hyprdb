import DatabaseOptions, { DatabaseOptionsBase } from './interfaces/DatabaseOptions';
import MathOperations from './interfaces/MathOperations';
import DriverOptions from './interfaces/DriverOptions';
import ManagerOptions from './interfaces/DatabaseManagerOptions';

import DataMap from './interfaces/DataMap';
import DataType from './interfaces/DataType';
import DataRecord from './interfaces/DataRecord';
import DataSignature from './interfaces/DataSignature';

/**
 * Hyper Database Module.
 */
declare module 'hypr.db' {
  /**
   * Database.
   * @since v1.0.0
   */
  export class Database<V extends DataSignature<V> = DataMap> {
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
     * Database size.
     */
    public readonly size: number;

    /**
     * Assign this database to other database.
     * @param other Database class.
     * @param callback Callback name.
     * @since v5.0.0
     * @example db.assign(wio, 'set');
     */
    public assign(other: any, callback?: string): Readonly<Record<string, boolean>>;

    /**
     * Get data with index.
     * @param keyIndex Key index.
     * @param valueIndex Value index.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array#at}
     * @since v5.0.0
     * @example db.at(1, 1); db.at(null, 1); db.at(1);
     */
    public at<K extends keyof V>(keyIndex?: number, valueIndex?: number): { key: K, value: V[K] };

    /**
     * Get all data from database.
     * @param amount Amount of data
     * @since v1.0.0
     * @example db.all(); db.all(5);
     */
    public all<K extends keyof V>(amount?: number): Array<{ key: K, value: V[K] }>;

    /**
     * Convert database to array.
     * @since v1.0.0
     * @example db.array().keys(); db.array().values();
     */
    public array<K extends keyof V>(): { keys: () => Array<K>, values: () => Array<V[K]> };

    /**
     * Add specified number of values to the specified key.
     * @param key Key
     * @param amount Amount to add.
     * @param negative Set it to be negative.
     * @since v1.0.0
     * @example db.add('version'); db.add('version', 2);
     */
    public add<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Concat databases.
     * @param databases Databases
     * @since v5.0.0
     * @example db.concat(db1, db2, db3);
     */
    public concat(...databases: Array<Database<V>>): Database<V>;

    /**
     * Delete data from database.
     * @param key Key
     * @since v1.0.0
     * @example db.del('version');
     */
    public del<K extends keyof V>(key: K): boolean;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callback
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array#every}
     * @since v5.0.0
     * @example db.every((value) => typeof value != 'string');
     */
    public every<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): boolean;

    /**
     * Performs the specified action for each element in an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach Array#forEach}
     * @since v7.0.0
     * @example db.each((value, key, index, hdb) => hdb.get(key));
     */
    public each<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => any): void;

    /**
     * Check key is exists in database.
     * @param key Key
     * @since v1.0.0
     * @example db.exists('version');
     */
    public exists<K extends keyof V>(key: K): boolean;

    /**
     * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
     * @param callback
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array#filter}
     * @since v1.0.0
     * @example db.filter((value) => value === '1');
     */
    public filter<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): Array<Database<V>>;

    /**
     * Find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array#find}
     * @since v1.0.0
     * @example db.find((value) => typeof value === 'string');
     */
    public find<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): V[K] | undefined;

    /**
     * Find the first value that satisfies the condition and update to new value.
     * @param value New value to replace.
     * @param callback Condition
     * @since v1.0.0
     * @example db.findUpdate('new version', (value, key) => key === 'version');
     */
    public findUpdate<K extends keyof V>(value: any, callback?: (value: V[K], key: K, index: number, Database: this) => boolean): void;

    /**
     * Find the first value that satisfies the condition and delete it.
     * @param callback Condition
     * @since v1.0.0
     * @example db.findDelete((value) => value === 'new version');
     */
    public findDelete<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): void;

    /**
     * Get data from database.
     * @param key Key
     * @since v1.0.0
     * @example db.get('version');
     */
    public get<K extends keyof V>(key: K): V[K];

    /**
     * Check key is exists in database.
     * @param key Key
     * @since v1.0.0
     * @example db.has('version');
     */
    public has<K extends keyof V>(key: K): boolean;

    /**
     * Set data to database.
     * @param key Key
     * @param value Value
     * @since v1.0.0
     * @example db.set('Application.Version', 1);
     */
    public set<K extends keyof V>(key: K, value: V[K]): V[K];

    /**
     * Subtraction in database over key.
     * @param key Key
     * @param amount Amount to subtract.
     * @param negative Set it to be negative.
     * @since v1.0.0
     * @example db.sub('version', 2); db.sub('version', 500, true);
     */
    public sub<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Search in database.
     * @param callback
     * @since v5.0.0
     * @example db.search((value) => db.get('version') === value);
     */
    public search<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): Array<{ key: K, value: V[K] }>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array#some}
     * @since v5.0.0
     * @example db.some((value, key) => db.get(key) === value);
     */
    public some<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): boolean;

    /**
     * Convert database to json.
     * @since v1.0.0
     * @example db.json();
     */
    public json(): DataRecord<V>;

    /**
     * Get data type of stored value in key.
     * @param key Key
     * @since v1.0.0
     * @example db.type('Application.Version');
     */
    public type<K extends keyof V>(key: K): DataType;

    /**
     * Do math in easily.
     * @param key Key
     * @param operator Operator.
     * @param count Count.
     * @param negative Set it to be negative.
     * @since v1.0.0
     * @example db.math('Application.Version', '+', 5); db.math('Application.Version', '-', 7, true);
     */
    public math<K extends keyof V>(key: K, operator: MathOperations, count: number, negative?: boolean): number;

    /**
     * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     * @since v1.0.0
     * @example db.map((value) => String(value));
     */
    public map<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): Database<V>;

    /**
     * Push values to array.
     * @param key Key
     * @param values Values to push.
     * @since v1.0.0
     * @example db.push('Applications', 'A1', 'A2');
     */
    public push<K extends keyof V>(key: K, ...values: Array<V[K]>): void;

    /**
     * Pulls data from array.
     * @param key Key
     * @param callback
     * @since v1.0.0
     * @example db.pull('Applications', (value) => value === 'A1');
     */
    public pull<K extends keyof V>(key: K, callback?: (value: V[K], index: number, Database: this) => boolean): Array<V[K]> | undefined;

    /**
     * Check database options.
     * @param options Options
     * @since v6.1.0
     * @example Database.checkOptions({}); Database.checkOptions('invalid');
     */
    static checkOptions(options?: DatabaseOptions): DatabaseOptionsBase;

    /**
     * Database version.
     * @example Database.version;
     */
    static readonly version: string;
  }

  /**
   * Database Manager
   * @since v7.1.0
   * @extends Map
   */
  export class DatabaseManager extends Map<string, Database> {
    /**
     * Create new Manager.
     * @param options Manager options.
     * @constructor
     */
    public constructor(options?: ManagerOptions);

    /**
     * Manager options.
     */
    protected readonly options: ManagerOptions;

    /**
     * Assign this manager to other manager.
     * @param other Other manager.
     * @since v7.1.0
     * @example mgr.assign(otherMgr);
     */
    public assign(other: DatabaseManager): Readonly<Record<string, boolean>>;

    /**
     * Get data with index.
     * @param keyIndex Key index.
     * @param valueIndex Value index.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array#at}
     * @since v7.1.0
     * @example mgr.at(1, 1); mgr.at(null, 1); mgr.at(1);
     */
    public at(keyIndex?: number, valueIndex?: number): { key: string, value: Database };

    /**
     * Get all data from manager.
     * @param amount Amount of data
     * @since v7.1.0
     * @example mgr.all(); mgr.all(5);
     */
    public all(amount?: number): Array<{ key: string, value: Database }>;

    /**
     * Convert manager to array.
     * @since v7.1.0
     * @example mgr.array().keys(); mgr.array().values();
     */
    public array(): { keys: () => Array<string>, values: () => Array<Database> };

    /**
     * Concat managers.
     * @param managers Managers.
     * @since v7.1.0
     * @example mgr.concat(mgr1, mgr2, mgr3);
     */
    public concat(...managers: Array<Database>): Database;

    /**
     * Delete data from manager.
     * @param key Key
     * @since v7.1.0
     * @example mgr.del('database1');
     */
    public del(key: string): boolean;

    /**
     * Performs the specified action for each element in an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach Array#forEach}
     * @since v7.1.0
     * @example db.each((value, key, index, hdb) => hdb.get(key));
     */
    public each(callback?: (value: Database, key: string, index: number, Database: this) => any): void;

    /**
     * Check key is exists in manager.
     * @param key Key
     * @since v7.1.0
     * @example db.exists('database1');
     */
    public exists(key: string): boolean;

    /**
     * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
     * @param callback
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array#filter}
     * @since v7.1.0
     * @example db.filter((value) => value === '1');
     */
    public filter(callback?: (value: Database, key: string, index: number, Database: this) => boolean): Array<Database>;

    /**
     * Find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array#find}
     * @since v7.1.0
     * @example db.find((value) => typeof value === 'string');
     */
    public find(callback?: (value: Database, key: string, index: number, Database: this) => boolean): Database | undefined;

    /**
     * Get data from manager.
     * @param key Key
     * @since v7.1.0
     * @example db.get('database1');
     */
    public get(key: string): Database | undefined;

    /**
     * Check key is exists in manager.
     * @param key Key
     * @since v7.1.0
     * @example db.has('database1');
     */
    public has(key: string): boolean;

    /**
     * Set data to manager.
     * @param key Key
     * @param value Value
     * @since v7.1.0
     * @example db.set('database1', db1);
     */
    // @ts-ignore
    public set(key: string, value: Database): Database;

    /**
     * Search in manager.
     * @param callback
     * @since v7.1.0
     * @example db.search((value) => db.get('version') === value);
     */
    public search(callback?: (value: Database, key: string, index: number, Database: this) => boolean): Array<{ key: string, value: Database }>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callback 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array#some}
     * @since v7.1.0
     * @example db.some((value, key) => db.get(key) === value);
     */
    public some(callback?: (value: Database, key: string, index: number, Database: this) => boolean): boolean;

    /**
     * Convert database to json.
     * @since v7.1.0
     * @example db.json();
     */
    public json(): object;

    /**
     * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callback Condition
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     * @since v7.1.0
     * @example db.map((value) => String(value));
     */
    public map(callback?: (value: Database, key: string, index: number, Database: this) => boolean): Database;

    /**
     * Check manager options.
     * @param options Options
     * @since v7.1.0
     * @example DatabaseManager.checkOptions({}); DatabaseManager.checkOptions('invalid');
     */
    static checkOptions(options?: DatabaseOptions): DatabaseOptionsBase;
  }

  export abstract class Driver<V extends DataSignature<V> = DataMap> extends Map<keyof V, V[keyof V]> {
    /**
     * Create new Database Driver.
     * @param options Driver options.
     * @constructor
     */
    public constructor(options?: DriverOptions);

    /**
     * Driver options.
     */
    protected readonly options: DriverOptions;

    /**
     * Read file and save to cache.
     */
    protected abstract read(): void;

    /**
     * Write cache to file.
     */
    protected abstract write(): void;

    public set<K extends keyof V>(key: K, value: V[K]): V[K];
    public get<K extends keyof V>(key: K): V[K] | undefined;
    public has<K extends keyof V>(key: K): boolean;
    public delete<K extends keyof V>(key: K): boolean;

    /**
     * Convert driver data to Array.
     */
    public array<K extends keyof V>(): { keys: () => Array<K>, values: () => Array<V[K]> };

    /**
     * Convert driver data to JSON.
     */
    public json(): DataRecord<V>;
    
    /**
     * Check driver options.
     * @param options Driver options.
     */
    static checkOptions(options: DriverOptions): DriverOptions;
  }

  export default Database;
}