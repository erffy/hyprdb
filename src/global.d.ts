declare module 'hypr.db' {
  export class Database<V extends hypr.DatabaseSignature<V> = hypr.DatabaseMap> {
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
     * Get value with index.
     * @param index Index
     */
    public valueAt<I extends number>(index?: I | number): V;
    /**
     * Get key with index.
     * @param index Index
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
    public toJSON(): hypr.DatabaseSignature<V>;
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
    public findUpdate<K extends keyof V>(value: V[K], callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): void;
    /**
     * Find the first value that satisfies the condition and delete it.
     * @param callback Condition
     */
    public findDelete<K extends keyof V>(callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): void;
    /**
     * Map database.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map}
     * @param callback Condition
     */
    public map<K extends keyof V>(callback?: (value: V[K], index: number, array: Array<V[K]>) => V[K]): void;
    /**
     * Get data type of stored value in key.
     * @param key Key
     */
    public type<K extends keyof V>(key: K): hypr.DataTypes;

    /**
     * Database version.
     */
    static readonly version: string;
  }

  export class JSONDriver extends hypr.JSONDriver {

  }

  export class BSONDriver extends hypr.BSONDriver {

  }

  export class YAMLDriver extends hypr.YAMLDriver {
    
  }
}

export declare namespace hypr {
  type AnyDatabaseDriver = JSONDriver | YAMLDriver | BSONDriver;
  type MathOperations = '+' | '-' | '/' | '**' | '*' | '%';
  type DatabaseSignature<V> = { [key in keyof V]: unknown };
  interface DatabaseMap {
    [key: string]: unknown;
  }
  type DataTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function' | 'NaN' | 'finite';
  
  class JSONDriver {
    public constructor(path?: string);

    private path: string;

    public readonly cache: object;

    public set(key: string, value?: unknown): unknown;
    public get(key: string): unknown;
    public delete(key: string): boolean;
    public exists(key: string): boolean;
    public update(key: string, value?: unknown): unknown;

    public write(): void;
    public save(): void;
    public read(): void;
    public load(): typeof this.cache;
  }

  class BSONDriver {
    public constructor(path?: string);

    private path: string;

    public readonly cache: object;
    public readonly json: object;

    public set(key: string, value?: unknown): unknown;
    public get(key: string): unknown;
    public delete(key: string): boolean;
    public exists(key: string): boolean;
    public update(key: string, value?: unknown): unknown;

    public save(): void;
    public load(): typeof this.cache;
  }

  class YAMLDriver {
    public constructor(path?: string);

    private path: string;

    public readonly cache: object;
    public readonly json: object;

    public set(key: string, value?: unknown): unknown;
    public get(key: string): unknown;
    public delete(key: string): boolean;
    public exists(key: string): boolean;
    public update(key: string, value?: unknown): unknown;

    public save(): void;
    public load(): typeof this.cache;
  }

  interface DatabaseOptions {
    path?: string;
    size?: number;
    overwrite?: boolean;
    driver?: AnyDatabaseDriver;
  }
}