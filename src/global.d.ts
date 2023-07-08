import _get from './functions/get.mjs';
import _has from './functions/has.mjs';
import _unset from './functions/unset.mjs';
import _set from './functions/set.mjs';
import _merge from './functions/merge.mjs';

declare module 'hypr.db' {
  export default class Database<V extends hypr.DatabaseSignature<V> = hypr.DatabaseMap> {
    public constructor(options?: hypr.DatabaseOptions);
    
    private options: hypr.DatabaseOptions;
    
    /**
     * Database driver.
     */
    public readonly driver: hypr.AnyDatabaseDriver;

    /**
     * Database size.
     */
    public readonly size: number;


    /**
     * Set data to database.
     * @param key Key
     * @param value Value
     */
    public set<K extends keyof V>(key: K, value: V[K]): V[K];

    /**
     * Get data with index.
     * @param keyIndex Key index.
     * @param valueIndex Value index.
     */
    public at<I extends number>(keyIndex?: I | number, valueIndex?: I | number): { key: string, value: unknown };

    /**
     * Get value with index.
     * @param index Index
     * @deprecated Please use 'at' instead.
     */
    public valueAt<I extends number>(index?: I | number): V;

    /**
     * Get key with index.
     * @param index Index
     * @deprecated Please use 'at' instead.
     */
    public keyAt<I extends number>(index?: I | number): string;

    /**
     * Update entry from database. If key is not exists, creates new key.
     * @param key Key
     * @param value New Value
     */
    public update<K extends keyof V>(key: K, value: V[K]): V[K];

    /**
     * Get data from database.
     * @param key Key
     */
    public get<K extends keyof V>(key: K): V[K];

    /**
     * Delete data from database.
     * @param key Key
     */
    public del<K extends keyof V>(key: K): boolean;

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public exists<K extends keyof V>(key: K): boolean;

    /**
     * Check key is exists in database.
     * @param key Key
     */
    public has<K extends keyof V>(key: K): boolean;

    /**
     * Get all data from database.
     * @param amount Amount of data
     */
    public all<K extends keyof V>(amount?: number): Array<{ key: K, value: V[K] }>;

    /**
     * Addition in database over key.
     * @param key Key
     * @param amount Amount to add.
     * @param negative Set it to be negative.
     */
    public add<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Subtraction in database over key.
     * @param key Key
     * @param amount Amount to subtract.
     * @param negative Set it to be negative.
     */
    public sub<K extends keyof V>(key: K, amount?: number, negative?: boolean): number;

    /**
     * Do math in easily.
     * @param key Key
     * @param numberOne First number.
     * @param operator Operator.
     * @param numberTwo Second number.
     * @param negative Set it to be negative.
     */
    public math<K extends keyof V>(key: K, numberOne: number, operator: hypr.MathOperations, numberTwo: number, negative?: boolean): number;

    /**
     * Push values to array.
     * @param key Key
     * @param values Values to push.
     */
    public push<K extends keyof V>(key: K, ...values: V[K]): void;

    /**
     * Pulls data from array.
     * @param key Key
     * @param callback Condition 
     */
    public pull<K extends keyof V>(key: K, callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): Array<V[K]>;

    /**
     * Convert database to array.
     */
    public toArray<K extends keyof V>(): { keys: Array<K>, values: Array<V[K]> };

    /**
     * Convert database to object.
     */
    public toJSON(): hypr.DatabaseMap;

    /**
     * Filter database.
     * @param callback Condition
     */
    public filter<K extends keyof V>(callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): Array<V[K]>;

    /**
     * Find the first value that satisfies the condition.
     * @param callback Condition
     */
    public find<K extends keyof V>(callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): boolean | Array<V[K]>;

    /**
     * Find the first value that satisfies the condition and update to new value.
     * @param value New value to replace.
     * @param callback Condition
     */
    public findUpdate<K extends keyof V>(value: V[K], callback?: (value: V[K], key: K, index: number, array: Array<V[K]>) => boolean): void;

    /**
     * Find the first value that satisfies the condition and delete it.
     * @param callback Condition
     */
    public findDelete<K extends keyof V>(callback?: (value: V[K], key: K, index: number, array: Array<V[K]>) => boolean): void;

    /**
     * Map database.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     * @param callback Condition
     */
    public map<K extends keyof V>(callback?: (value: V[K], key: K, index: number, array: Array<V[K]>) => V[K]): void;

    /**
     * Get data type of stored value in key.
     * @param key Key
     */
    public type<K extends keyof V>(key: K): hypr.DataTypes;

    
    /**
     * Drivers.
     */
    static readonly Drivers = {
      /**
       * Driver.
       */
      Driver: hypr.Driver,

      /**
       * BSON Driver.
       */
      BSONDriver: hypr.BSONDriver,

      /**
       * YAML Driver.
       */
      YAMLDriver: hypr.YAMLDriver,

      /**
       * JSON Driver.
       */
      JSONDriver: hypr.JSONDriver,

      /**
       * TOML Driver.
       */
      TOMLDriver: hypr.TOMLDriver,

      /**
       * HJSON Driver.
       */
      HJSONDriver: hypr.HJSONDriver,

      /**
       * JSON5 Driver.
       */
      JSON5Driver: hypr.JSON5Driver,

      /**
       * INI Driver.
       */
      INIDriver: hypr.INIDriver,

      /**
       * CSV Driver.
       */
      CSVDriver: hypr.CSVDriver
    }

    /**
     * Database version.
     */
    static readonly version: string;
  }

  /**
   * Database Drivers.
   */
  export const Drivers = Database.Drivers;
}

export declare namespace hypr {
  type AnyDatabaseDriver = Driver | JSONDriver | YAMLDriver | BSONDriver | TOMLDriver | JSON5Driver | HJSONDriver | INIDriver | CSONDriver | CSVDriver;
  type MathOperations = '+' | '-' | '/' | '**' | '*' | '%';
  type DatabaseSignature<V> = { [key in keyof V]: unknown };
  type Encoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
  type DataTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function' | 'NaN' | 'finite';
  
  abstract class Driver {
    public constructor(path?: string, name?: string, extension?: string);

    protected readonly path: string;
    protected readonly name: string;
    protected readonly extension: string;

    public readonly cache: object;

    public set(key: string, value?: unknown): unknown;
    public get(key: string): unknown;
    public has(key: string): boolean;
    public edit(key: string, value?: unknown): unknown;
    public unset(key: string): boolean;
    public clone(path: string): void;

    public save(data: unknown, encoding?: Encoding): void;
    public read(handler: (data: unknown) => unknown, encoding?: Encoding): void;

    static readonly set = _set;
    static readonly get = _get;
    static readonly has = _has;
    static readonly merge = _merge;
    static readonly unset = _unset;
  }

  class JSONDriver extends Driver {
    public constructor(path?: string, name?: string, spaces?: number);
  }

  class BSONDriver extends Driver {
    public constructor(path?: string, name?: string);
  }

  class YAMLDriver extends BSONDriver {

  }

  class TOMLDriver extends BSONDriver {

  }

  class HJSONDriver extends BSONDriver {

  }

  class JSON5Driver extends JSONDriver {

  }

  class INIDriver extends BSONDriver {

  }

  class CSONDriver extends BSONDriver {

  }

  class CSVDriver extends BSONDriver {

  }

  interface DatabaseOptions {
    /**
     * Database Path.
     * @default database.json
     */
    path?: string;

    /**
     * Spaces. (Only JSON and JSON5)
     * @default 2
     */
    spaces?: number;

    /**
     * Database Size.
     * @default 0
     */
    size?: number;

    /**
     * Database Overwrite. (Only 'push' method.)
     * @default true
     */
    overwrite?: boolean;

    /**
     * Database Driver.
     * @default JSONDriver
     */
    driver?: AnyDatabaseDriver;
  }

  interface DatabaseMap {
    [key: string]: unknown;
  }
}