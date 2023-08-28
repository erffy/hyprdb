const version: string = (require('../../package.json')).version;

import Driver from './Driver';

import { DatabaseOptions, DatabaseDefaultOptions } from '../interfaces/DatabaseOptions';
import { PingResult } from '../interfaces/PingResult';
import { MathOperations } from '../interfaces/MathOperations';

const __ping = (result: PingResult) => console.log(`[${result.from} [${result.average}]] set: ${result.set} | get: ${result.get} | del: ${result.del}`);

export default class Database<V = any> {
  protected readonly driver: Driver<V>;
  public readonly options: DatabaseOptions;

  public constructor(options: DatabaseOptions = DatabaseDefaultOptions) {
    Database.checkOptions(options);

    this.options = options;
    this.driver = new Driver<V>(options.driver);
  };

  *[Symbol.iterator]() {
    yield* this.driver;
  };

  get size() {
    return this.driver.size;
  };

  public assign(other: any, options: { callbackName?: string } = {}): Readonly<Record<string, boolean>> {
    if (!other?.constructor) throw new Error('\'other\' is not constructor.');

    options.callbackName ??= 'set';

    const obj: Record<string, boolean> = {};

    const data: Record<string, V> = this.json();
    for (const key in data) {
      if (typeof other[options.callbackName] != 'function') throw new TypeError(`'${other.constructor.name}.${options.callbackName}' is not function.`);

      try {
        other[options.callbackName](key, data[key]);
        Object.defineProperty(obj, key, { value: true, writable: false, configurable: false, enumerable: true });
      } catch (error) {
        throw new Error(`AssignError: ${error}`);
      };
    };

    return obj;
  };

  public at(keyIndex?: number, valueIndex?: number): { key: string, value: V } {
    keyIndex ??= 0;
    valueIndex ??= 0;

    if (typeof keyIndex != 'number') throw new TypeError('\'keyIndex\' is not number.');
    if (typeof valueIndex != 'number') throw new TypeError('\'valueIndex\' is not number.');

    const array = this.array();

    const key: string = array.keys[keyIndex];
    const value: V = array.values[valueIndex];

    return { key, value };
  };

  public all(amount: number = 0): Array<{ key: string, value: V }> {
    if (typeof amount != 'number') throw new TypeError('\'amount\' is not number.');

    const obj: Record<string, V> = this.json();
    const keys: Array<string> = Object.keys(obj);

    let results: Array<{ key: string, value: V }> = [];
    for (let index: number = 0; index < keys.length; index++) results.push({ key: keys[index], value: obj[keys[index]] });

    if (amount > 0) results = results.splice(0, amount);

    return results;
  };

  public array(): { keys: Array<string>, values: Array<V> } {
    return this.driver.array();
  };

  public add(key: string, amount: number = 1, negative: boolean = false): number {
    return this.math(key, '+', amount, negative);
  };

  public del(key: string): boolean {
    return this.driver.delete(key);
  };

  public every(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: any }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (!(callback(value, key, index, this))) return false;
    };

    return true;
  };

  public each(callback: Function): void {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      callback(value, key, index, this);
    };

    return void 0;
  };

  public exists(key: string): boolean {
    return this.driver.has(key);
  };

  public filter(callback: Function): Database<V> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  public find(callback: Function): V | undefined {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    let collected: boolean = false;

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; (!collected && index < data.length); index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) {
        collected = !collected;
        return value;
      };
    };

    return undefined;
  };

  public findUpdate(newValue: V, callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    let updated: boolean = false;

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) {
        if (this.set(key, newValue)) updated = !updated;
      };
    };

    return updated;
  };

  public findDelete(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    let deleted: boolean = false;

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) deleted = this.del(key);
    };

    return deleted;
  };

  public get(key: string): V | undefined {
    return this.driver.get(key);
  };

  public has(key: string): boolean {
    return this.exists(key);
  };

  public set(key: string, value: V): V {
    // @ts-ignore
    if (this.options.size != 0 && (this.size > this.options.size)) throw new RangeError('Database limit exceeded.');

    return this.driver.set(key, value);
  };

  public sub(key: string, amount: number = 1, negative: boolean = false): number {
    return this.math(key, '-', amount, negative);
  };

  public search(callback: Function): Array<{ key: string, value: V }> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const collected: Array<{ key: string, value: V }> = [];
    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) collected.push({ key, value });
    };

    return collected;
  };

  public some(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) return true;
    };

    return false;
  };

  public json(): Record<string, V> {
    return this.driver.json();
  };

  public type(key: string): string {
    const data: V | undefined = this.get(key);

    let __type;
    if (Array.isArray(data)) __type = 'array';
    else __type = typeof data;

    return __type;
  };

  public math(key: string, operator: MathOperations, count: number, negative: boolean = false): number {
    if (typeof operator != 'string') throw new TypeError('\'operator\' is not string.');
    if (typeof count != 'number') throw new TypeError('\'count\' is not number.');
    // @ts-ignore
    if (!this.exists(key)) this.set(key, 0);
    // @ts-ignore
    const data: V = this.get(key);
    if (typeof data != 'number') throw new TypeError('\'data\' is not number.');
    // @ts-ignore
    let result: number = data;
    if (operator === '+') result += count;
    else if (operator === '-') result -= count;
    else if (operator === '*') result *= count;
    else if (operator === '**') result **= count;
    else if (operator === '/') result /= count;
    else if (operator === '%') result %= count;

    if (!negative && result < 0) result = 0;
    // @ts-ignore
    return this.set(key, result);
  };

  public map(callback: Function): Database<V> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: string, value: V }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: V } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  public push(key: string, ...values: Array<V>): void {
    const data: V | undefined = this.get(key);
    // @ts-ignore
    if (!data) this.set(key, values);

    if (Array.isArray(data)) {
      // @ts-ignore
      if (this.options.overWrite) this.set(key, values);
      // @ts-ignore
      else this.set(key, [...data, ...values]);
      // @ts-ignore
    } else this.set(key, values);

    return void 0;
  };

  public pull(key: string, callback: Function): Array<V> | undefined {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    if (!this.exists(key)) return undefined;

    const data = this.get(key);
    if (!Array.isArray(data)) throw new TypeError('\'data\' is not array.');

    const result: Array<V> = [];
    for (let index: number = 0; index < data.length; index++) {
      const value: V = data[index];

      if (!callback(value, index, this)) result.push(value);
    };
    // @ts-ignore
    return this.set(key, result);
  };

  public ping(callback: Function = __ping): PingResult {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const version: number = Number((process.version.split('v'))[0]);
    const runfn: Function = (version > 15) ? performance.now : Date.now;

    const random: string = (Math.floor(Math.random() * 100)).toString();

    const setStart: number = runfn();
    // @ts-ignore
    this.set(random, 0);
    const setEnd: number = runfn();

    const getStart: number = runfn();
    this.get(random);
    const getEnd: number = runfn();

    const delStart: number = runfn();
    this.del(random);
    const delEnd: number = runfn();

    let set: string | number = (setEnd - setStart);
    let get: string | number = (getEnd - getStart);
    let del: string | number = (delEnd - delStart);
    let average: string = (((set + get + del) / 3).toFixed(2)).concat('ms');

    set = (set.toFixed(2)).concat('ms');
    get = (get.toFixed(2)).concat('ms');
    del = (del.toFixed(2)).concat('ms');
    // @ts-ignore
    const results = { from: this.driver.options?.useHexEncoding ? 'hex' : 'json', set, get, del, average };

    callback(results);

    return results;
  };

  static concat<V = any>(databases: Array<Database<V>>, options: DatabaseOptions): Database<V> {
    if (!Array.isArray(databases)) throw new TypeError('\'databases\' is not array.');
    if (typeof options != 'object') throw new TypeError('\'options\' is not object.');

    const db: Database<V> = new Database<V>(options);

    for (const database of databases) {
      const data: Array<{ key: string, value: V }> = database.all();

      for (const { key, value } of data) db.set(key, value);
    };

    return db;
  };

  static checkOptions(options: DatabaseOptions): DatabaseOptions {
    if (typeof options != 'object') throw new TypeError('\'options\' is not object.');

    options.autoWrite ??= DatabaseDefaultOptions.autoWrite;
    options.overWrite ??= DatabaseDefaultOptions.overWrite;
    options.size ??= DatabaseDefaultOptions.size;
    options.spaces ??= DatabaseDefaultOptions.spaces;
    options.driver ??= DatabaseDefaultOptions.driver;

    if (typeof options?.autoWrite != 'boolean') throw new TypeError('\'options.autoWrite\' is not boolean.');
    if (typeof options?.overWrite != 'boolean') throw new TypeError('\'options.overWrite\' is not boolean.');
    if (typeof options?.size != 'number') throw new TypeError('\'options.size\' is not number.');
    if (typeof options?.spaces != 'number') throw new TypeError('\'options.spaces\' is not number.');
    if (typeof options?.driver != 'object') throw new TypeError('\'options.driver\' is not object.');

    if (options.driver) Driver.checkOptions(options.driver);

    return options;
  };

  static readonly version = version;
};

export { DatabaseOptions } from '../interfaces/DatabaseOptions';