import { DatabaseOptions } from './lib/interfaces/DatabaseOptions';
import { MathOperations } from './lib/interfaces/MathOperations';
import { PingResult } from './lib/interfaces/PingResult';
import { AnyDatabaseDriver } from './lib/interfaces/AnyDatabaseDriver';

/**
 * Hyper Database Module.
 */
declare module 'hypr.db' {
  // @ts-ignore
  export default class Database<V extends DatabaseSignature<V> = DatabaseMap> {
    /**
     * Create new Database.
     * @param options Database options.
     * @constructor
     */
    public constructor(options?: DatabaseOptions);

    /**
     * Database options.
     */
    private options: DatabaseOptions;

    /**
     * Database size.
     */
    public readonly size: number;


    /**
     * Assign this database to other database.
     * @param other Database class.
     * @param options Assign options.
     */
    public assign(other: any, options?: { callbackName?: string }): Record<string, boolean>;

    /**
     * Get data with index.
     * @param keyIndex Key index.
     * @param valueIndex Value index.
     */
    public at<I extends number>(keyIndex?: I | number, valueIndex?: I | number): { key: string | undefined, value: V };

    /**
     * Get all data from database.
     * @param amount Amount of data
     */
    public all<K extends keyof V>(amount?: number): Array<{ key: K, value: V[K] }>;

    /**
     * Convert database to array.
     */
    public array<K extends keyof V>(): { keys: Array<K>, values: Array<V[K]> };

    /**
     * Add specified number of values to the specified key.
     * @param key Key
     * @param amount Amount to add.
     * @param negative Set it to be negative.
     */
    public add<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Clone database. (like Backup)
     * @param path Clone path.
     */
    public clone(path?: string): void;

    /**
     * Delete data from database.
     * @param key Key
     */
    public del<K extends keyof V>(key: K): boolean;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callback 
     */
    public every<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): boolean;

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public exists<K extends keyof V>(key: K): boolean;

    /**
     * A function that accepts up to four arguments. The filter method calls the predicate function one time for each element in the array.
     * @param callback
     */
    public filter<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): Database<V>;

    /**
     * Find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param callback Condition
     */
    public find<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): boolean | V[K];

    /**
     * Find the first value that satisfies the condition and update to new value.
     * @param value New value to replace.
     * @param callback
     */
    public findUpdate<K extends keyof V>(value: V[K], callback?: (value: V[K], key: K, index: number, Database: this) => boolean): void;

    /**
     * Find the first value that satisfies the condition and delete it.
     * @param callback
     */
    public findDelete<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): void;

    /**
     * Get data from database.
     * @param key Key
     */
    public get<K extends keyof V>(key: K): V[K];

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public has<K extends keyof V>(key: K): boolean;

    /**
     * Set data to database.
     * @param key Key
     * @param value Value
     */
    public set<K extends keyof V>(key: K, value?: V[K]): V[K];

    /**
     * Subtraction in database over key.
     * @param key Key
     * @param amount Amount to subtract.
     * @param negative Set it to be negative.
     */
    public sub<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Search in database.
     * @param callback
     */
    public search<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): Array<{ key: string, value: V }>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callback 
     */
    public some<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => boolean): boolean;

    /**
     * Convert database to json.
     */
    public json(): Record<string, V>;

    /**
     * Get data type of stored value in key.
     * @param key Key
     */
    public type<K extends keyof V>(key: K): DataTypes;

    /**
     * Do math in easily.
     * @param key Key
     * @param operator Operator.
     * @param count Count.
     * @param negative Set it to be negative.
     */
    public math<K extends keyof V>(key: K, operator: MathOperations, count: number, negative?: boolean): number;

    /**
     * A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     * @param callback Condition
     */
    public map<K extends keyof V>(callback?: (value: V[K], key: K, index: number, Database: this) => any): Database<V>;

    /**
     * Push values to array.
     * @param key Key
     * @param values Values to push.
     */
    public push<K extends keyof V>(key: K, ...values: V[K]): void;

    /**
     * Pulls data from array.
     * @param key Key
     * @param callback
     */
    public pull<K extends keyof V>(key: K, callback?: (value: V[K], index: number, Database: this) => boolean): Array<V[K]>;

    /**
     * Calculate database ping.
     * @param callback
     */
    public ping(callback?: (result: PingResult) => any): PingResult;

    /**
     * Concat databases.
     * @param databases Hypr databases to concat.
     */
    static concat(...databases: Array<Database>): Database;

    /**
     * Drivers.
     */
    // @ts-ignore
    static readonly Drivers = {
      /**
       * Driver.
       */
      Driver,

      /**
       * BSON Driver.
       */
      BSON,

      /**
       * YAML Driver.
       */
      YAML,

      /**
       * JSON Driver.
       */
      JSON,

      /**
       * TOML Driver.
       */
      TOML,

      /**
       * JSON5 Driver.
       */
      JSON5,

      /**
       * INI Driver.
       */
      INI
    }

    /**
     * Database version.
     */
    static readonly version: string;
  }

  /**
   * Database Drivers.
   */
  // @ts-ignore
  export const Drivers = Database.Drivers;
  // @ts-ignore
  export const Database = Database;

  export type DataTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function' | 'NaN' | 'finite';

  abstract class Driver<V extends DatabaseSignature<V> = DatabaseMap> extends Map {
    /**
     * Create new driver.
     * @param path Driver path.
     * @param name Driver name. (file)
     * @param extension Driver extension.
     * @constructor
     */
    public constructor(path?: string, name?: string, extension?: string);

    /**
     * Database path.
     */
    public readonly path: string;
    /**
     * Database name.
     */
    public readonly name: string;
    /**
     * Database extension.
     */
    public readonly extension: string;

    public override set<K extends keyof V>(key: K, value?: V[K], autoWrite?: boolean): V[K];
    public override get<K extends keyof V>(key: K): V[K];
    public override has<K extends keyof V>(key: K): boolean;
    public override delete<K extends keyof V>(key: K, autoWrite?: boolean): boolean;
    public clone(path?: string): void;

    /**
     * Save database.
     * @param data Data to save database file.
     * @param encoding Encoding
     */
    public save(data: any, encoding?: BufferEncoding): void;
    /**
     * Read database and save to cache.
     * @param handler Data handler.
     * @param encoding Encoding.
     */
    public read(handler: (data: any) => Record<string, any>, encoding?: BufferEncoding): void;
  }

  class JSON extends Driver {
    public constructor(path?: string, name?: string, spaces?: number);
  }

  class BSON extends Driver {
    public constructor(path?: string, name?: string);
  }

  class YAML extends BSON {

  }

  class TOML extends BSON {

  }

  class JSON5 extends JSON {

  }

  class INI extends BSON {

  }

  /**
   * Database Options.
   * @interface
   */
  export interface DatabaseOptions {
    /**
     * Database Name.
     * @default hypr
     */
    name?: string;

    /**
     * Check hypr.db updates when created new database.
     * @default true
     */
    updates?: boolean;

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
    driver: AnyDatabaseDriver;
  }

  export interface PingResult {
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

  export interface DatabaseMap {
    [key: string]: any;
  }
}