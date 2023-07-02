declare module 'nova.db' {
  export class Database<V extends novadatabase.Signature<V> = unknown> {
    public constructor(options?: novadatabase.DatabaseOptions);
    
    private options: novadatabase.DatabaseOptions;
    
    /**
     * Database provider.
     */
    public readonly provider: novadatabase.AnyDatabaseProvider;
    /**
     * Database size.
     */
    public readonly size: number;

    /**
     * Set data to database.
     * @param key Key
     * @param value Value
     */
    public set<K extends keyof V>(key: K | string, value: V[K]): V[K];
    /**
     * Get value with index.
     * @param index Index
     */
    public valueAt<I extends number>(index?: I): V[I];
    /**
     * Get key with index.
     * @param index Index
     */
    public keyAt<I extends number>(index?: I): string;
    /**
     * Update entry from database. If key is not exists, creates new key.
     * @param key Key
     * @param value New Value
     */
    public update<K extends keyof V>(key: K | string, value: V[K]): V[K];
    /**
     * Get data from database.
     * @param key Key
     */
    public get<K extends keyof V>(key: K | string): V[K];
    /**
     * Delete data from database.
     * @param key Key
     */
    public del<K extends keyof V>(key: K | string): boolean;
    /**
     * Check key is exists in database.
     * @param key Key
     */
    public exists<K extends keyof V>(key: K | string): boolean;
    /**
     * Check key is exists in database.
     * @param key Key
     */
    public has<K extends keyof V>(key: K | string): boolean;
    /**
     * Get all data from database.
     * @param amount Amount of data
     */
    public all<K extends keyof V>(amount?: number): Array<{ key: K | string, value: V[K] }>;
    /**
     * Addition in database over key.
     * @param key Key
     * @param amount Amount to add.
     * @param negative Set it to be negative.
     */
    public add<K extends keyof V>(key: K | string, amount?: number, negative?: boolean): number;
    /**
     * Subtraction in database over key.
     * @param key Key
     * @param amount Amount to subtract.
     * @param negative Set it to be negative.
     */
    public sub<K extends keyof V>(key: K | string, amount?: number, negative?: boolean): number;
    /**
     * Do math in easily.
     * @param key Key
     * @param numberOne First number.
     * @param operator Operator.
     * @param numberTwo Second number.
     * @param negative Set it to be negative.
     */
    public math<K extends keyof V>(key: K | string, numberOne: number, operator: novadatabase.MathOperations, numberTwo: number, negative?: boolean): number;
    /**
     * Push values to array.
     * @param key Key
     * @param values Values to push.
     */
    public push<K extends keyof V>(key: K | string, ...values: Array<any>): void;
    /**
     * Pulls data from array.
     * @param key Key
     * @param callback Condition 
     */
    public pull<K extends keyof V>(key: K | string, callback?: (value: V[K], index: number, array: Array<V[K]>) => boolean): Array<V[K]>;
    /**
     * Convert database to array.
     */
    public toArray<K extends keyof V>(): { keys: Array<K | string>, values: Array<V[K]> };
    /**
     * Convert database to object.
     */
    public toJSON(): novadatabase.Signature<V>;
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
     * @param callback 
     */
    public map<K extends keyof V>(callback?: (value: V[K], index: number, array: Array<V[K]>) => unknown): void;
    /**
     * Get data type of stored value in key.
     * @param key Key
     */
    public type<K extends keyof V>(key: K | string): novadatabase.DataTypes;

    /**
     * Database version.
     */
    static readonly version: string;
  }

  export class JSONProvider extends novadatabase.JSONProvider {

  }

  export class BSONProvider extends novadatabase.BSONProvider {

  }

  export class YAMLProvider extends novadatabase.YAMLProvider {
    
  }
}

export declare namespace novadatabase {
  type AnyDatabaseProvider = JSONProvider | YAMLProvider | BSONProvider;
  type MathOperations = '+' | '-' | '/' | '**' | '*' | '%';
  type Signature<V> = { [key in keyof V]: V[key] };
  type DataTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'array' | 'undefined' | 'object' | 'function' | 'NaN' | 'finite';
  
  class JSONProvider {
    public constructor(path?: string, spaces?: number);

    private path: string;

    public write(data: object): void;
    public read(): string;
    public toJSON(): object;
  }

  class BSONProvider extends JSONProvider {

  }

  class YAMLProvider extends JSONProvider {

  }

  interface DatabaseOptions {
    path?: string;
    size?: number;
    spaces?: number;
    provider?: AnyDatabaseProvider;
  }
}