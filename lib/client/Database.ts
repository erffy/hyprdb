const version: string = (require('../../package.json')).version;

import Driver from 'drivers/Driver';

import DatabaseOptions, { DatabaseOptionsBase, DatabaseOptionsDefault } from 'interfaces/DatabaseOptions';
import MathOperations from 'interfaces/MathOperations';

import DataMap from 'interfaces/DataMap';
import DataRecord from 'interfaces/DataRecord';
import DataSignature from 'interfaces/DataSignature';

export default class Database<V extends DataSignature<V> = DataMap> {
  protected readonly options: DatabaseOptionsBase;

  public constructor(options: DatabaseOptions = DatabaseOptionsDefault) {
    this.options = Database.checkOptions(options);

    const nodeVersion: number = Number(process.versions.node.split('.')[0]);
    if (nodeVersion < 14) throw new RangeError('Your node version is not compatible.');
  };

  *[Symbol.iterator]() {
    yield* this.options.driver;
  };

  size() {
    return this.options.driver.size;
  };

  public assign(other: any, callback: string = 'set'): Readonly<Record<string, boolean>> {
    if (!other?.constructor) throw new Error('\'other\' is not constructor.');
    if (callback && typeof callback != 'string') throw new TypeError('\'callback\' is not string.');

    const obj: Record<string, boolean> = {};

    const data: Record<string, V> = this.json();
    for (const key in data) {
      if (typeof other[callback] != 'function') throw new TypeError(`'${other.constructor.name}.${callback}' is not function.`);

      try {
        other[callback](key, data[key]);
        Object.defineProperty(obj, key, { value: true, writable: false, configurable: false, enumerable: true });
      } catch (error) {
        console.log(new Error(`AssignError: ${error}`));
        Object.defineProperty(obj, key, { value: false, writable: false, configurable: false, enumerable: true });
      };
    };

    return obj;
  };

  public at<K extends keyof V>(keyIndex?: number, valueIndex?: number): { key: K | undefined, value: V[K] | undefined } {
    if (keyIndex && typeof keyIndex != 'number') throw new TypeError('\'keyIndex\' is not number.');
    if (valueIndex && typeof valueIndex != 'number') throw new TypeError('\'valueIndex\' is not number.');

    const array = this.array();

    const key: K | undefined = keyIndex ? array.keys().at(keyIndex) as K : undefined;
    const value: V[K] | undefined = valueIndex ? array.values().at(valueIndex) as V[K] : undefined;

    return { key, value };
  };

  public all<K extends keyof V>(amount: number = 0): Array<{ key: K, value: V[K] }> {
    if (typeof amount != 'number') throw new TypeError('\'amount\' is not number.');

    const obj: DataRecord<V> = this.json();

    let results: Array<{ key: K, value: V[K] }> = [];
    // @ts-ignore
    for (const key in obj) results.push({ key, value: obj[key] });

    if (amount > 0) results = results.slice(0, amount);

    return results;
  };

  public array<K extends keyof V>(): { keys: () => Array<K>, values: () => Array<V[K]> } {
    const data: DataRecord<V> = this.json();

    const keys: Function = (): Array<K> => {
      const _keys: Array<K> = [];

      for (const key in data) _keys.push(key as unknown as K);

      return _keys;
    };

    const values: Function = (): Array<V[K]> => {
      const _values: Array<V[K]> = [];

      for (const key in data) _values.push(data[key] as unknown as V[K]);

      return _values;
    };
    // @ts-ignore
    return { keys, values };
  };

  public add<K extends keyof V>(key: K, amount?: number, negative?: boolean): number {
    return this.math(key, '+', amount, negative);
  };

  public concat<K extends keyof V>(...databases: Array<Database<V>>): Database<V> {
    if (!Array.isArray(databases)) throw new TypeError('\'databases\' is not array.');
    if (databases.length < 1) throw new RangeError('\'databases\' cant be less than 1.');

    databases.unshift(this);

    const db: Database<V> = new Database<V>(this.options);
    for (const database of databases) {
      const data: Array<{ key: K, value: V[K] }> = database.all();

      for (const { key, value } of data) db.set(key, value);
    };

    return db;
  };

  public del<K extends keyof V>(key: K): boolean {
    return this.options.driver.delete(key as string);
  };

  public every<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (!(callback(value, key, index, this))) return false;
    };

    return true;
  };

  public each<K extends keyof V>(callback: Function): void {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      callback(value, key, index, this);
    };

    return void 0;
  };

  public exists<K extends keyof V>(key: K): boolean {
    return this.options.driver.has(key as string);
  };

  public filter<K extends keyof V>(callback: Function): Database<V> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  public find<K extends keyof V>(callback: Function): V[K] | undefined {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) return value;
    };

    return undefined;
  };

  public findUpdate<K extends keyof V>(newValue: any, callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    let updated: boolean = false;

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) {
        if (this.set(key, newValue)) updated = !updated;
      };
    };

    return updated;
  };

  public findDelete<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    let deleted: boolean = false;

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) deleted = this.del(key);
    };

    return deleted;
  };

  public get<K extends keyof V>(key: K): V[K] | undefined {
    return this.options.driver.get(key as string);
  };

  public has<K extends keyof V>(key: K): boolean {
    return this.exists(key);
  };

  public set<K extends keyof V>(key: K, value: V[K]): V[K] {
    // @ts-ignore
    if (this.options.size != 0 && (this.options.driver.size > this.options.size)) throw new RangeError('Database limit exceeded.');

    return this.options.driver.set(key as string, value);
  };

  public sub<K extends keyof V>(key: K, amount?: number, negative?: boolean): number {
    return this.math(key, '-', amount, negative);
  };

  public search<K extends keyof V>(callback: Function): Array<{ key: K, value: V[K] }> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const collected: Array<{ key: K, value: V[K] }> = [];
    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) collected.push({ key, value });
    };

    return collected;
  };

  public some<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) return true;
    };

    return false;
  };

  public json(): DataRecord<V> {
    return this.options.driver.json() as DataRecord<V>;
  };

  public type<K extends keyof V>(key: K): string {
    const data: V | undefined = this.get(key);

    let __type;
    if (Array.isArray(data)) __type = 'array';
    else __type = typeof data;

    return __type;
  };

  public math<K extends keyof V>(key: K, operator: MathOperations, count: number = 1, negative: boolean = false): number {
    if (typeof operator != 'string') throw new TypeError('\'operator\' is not string.');
    if (typeof count != 'number') throw new TypeError('\'count\' is not number.');
    // @ts-ignore
    if (!this.exists(key)) this.set(key, 0);
    // @ts-ignore
    let data: V[K] | number = this.get(key);
    if (typeof data != 'number') throw new TypeError('\'data\' is not number.');
    // @ts-ignore
    switch (operator) {
      case '+': data += count; break;
      case '-': data -= count; break;
      case '%': data %= count; break;
      case '*': data *= count; break;
      case '/': data /= count; break;
      case '**': data **= count; break;
      default: throw new RangeError(`'${operator}' is not supported.`);
    };
    
    if (!negative && data < 0) data = 0;
    // @ts-ignore
    return this.set(key, data);
  };

  public map<K extends keyof V>(callback: Function): Database<V> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: K, value: V[K] } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  public push<K extends keyof V>(key: K, ...values: Array<V[K]>): void {
    const data: V[K] | undefined = this.get(key);
    // @ts-ignore
    if (!data) this.set(key, values);

    if (Array.isArray(data)) {
      // @ts-ignore
      if (this.options.overWrite) this.set(key, values);
      // @ts-ignore
      else this.set(key, data.concat(values));
      // @ts-ignore
    } else this.set(key, values);

    return void 0;
  };

  public pull<K extends keyof V>(key: K, callback: Function): Array<V[K]> | undefined {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    if (!this.exists(key)) return undefined;
    // @ts-ignore
    const data: V[K] = this.get(key);
    if (!Array.isArray(data)) throw new TypeError('\'data\' is not array.');

    const result: Array<V> = [];
    for (let index: number = 0; index < data.length; index++) {
      const value: V[K] = data[index];

      if (!callback(value, index, this)) result.push(value);
    };
    // @ts-ignore
    return this.set(key, result);
  };

  static checkOptions(options?: DatabaseOptions): DatabaseOptionsBase {
    options ??= DatabaseOptionsDefault;
    if (typeof options != 'object') throw new TypeError('\'options\' is not object.');

    options.autoWrite ??= DatabaseOptionsDefault.autoWrite;
    options.overWrite ??= DatabaseOptionsDefault.overWrite;
    options.size ??= DatabaseOptionsDefault.size;
    options.driver ??= DatabaseOptionsDefault.driver;

    if (typeof options.autoWrite != 'boolean') throw new TypeError('\'options.autoWrite\' is not boolean.');
    if (typeof options.overWrite != 'boolean') throw new TypeError('\'options.overWrite\' is not boolean.');
    if (typeof options.size != 'number') throw new TypeError('\'options.size\' is not number.');
    if (!(options.driver instanceof Driver)) throw new TypeError('\'options.driver\' is not valid driver.');

    return options as DatabaseOptionsBase;
  };

  static readonly version: string = version;
};