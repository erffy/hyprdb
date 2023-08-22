const version: string = '6.1.3';

import DatabaseError from './DatabaseError';
import * as Drivers from '../drivers/index';

import { DatabaseSignature } from '../interfaces/DatabaseSignature';
import { DatabaseMap } from '../interfaces/DatabaseMap';
import { DatabaseOptions, DatabaseDefaultOptions } from '../interfaces/DatabaseOptions';
import { PingResult } from '../interfaces/PingResult';
import { MathOperations } from '../interfaces/MathOperations';

const __ping = (result: PingResult) => console.log(`[${result.from} [${result.average}]] set: ${result.set} | get: ${result.get} | del: ${result.del}`);

export default class Database<V extends DatabaseSignature<V> = DatabaseMap> {
  public size: number;
  protected readonly options: DatabaseOptions;

  public constructor(options: DatabaseOptions = DatabaseDefaultOptions) {
    Database.checkOptions(options);

    this.options = options;
    this.size = ((this.array()).keys).length;
  };

  public assign(other: any, options: { callbackName?: string } = {}): Readonly<Record<string, boolean>> {
    if (!other?.constructor) new DatabaseError({ message: '\'other\' is not a constructor.' });

    options.callbackName ??= 'set';

    const obj: Record<string, boolean> = {};

    const data: Record<string, any> = this.json();
    for (const key in data) {
      if (typeof other[options.callbackName] != 'function') new DatabaseError({ message: `'${other.constructor.name}.${options.callbackName}' is not function.` });

      try {
        other[options.callbackName](key, data[key]);
        Object.defineProperty(obj, key, { value: true, writable: false, configurable: false, enumerable: true });
      } catch (error) {
        new DatabaseError({ message: `AssignError: ${error}` });
      };
    };

    return obj;
  };

  public at<I extends number>(keyIndex?: I | number, valueIndex?: I | number): { key: string, value: V } {
    keyIndex ??= 0;
    valueIndex ??= 0;

    if (typeof keyIndex != 'number') new DatabaseError({ expected: 'number', received: typeof keyIndex });
    if (typeof valueIndex != 'number') new DatabaseError({ expected: 'number', received: typeof valueIndex });

    const array = this.array();

    const key = array.keys[keyIndex];
    const value = array.values[valueIndex];

    return { key, value };
  };

  public all<K extends keyof V>(amount: number = 0): Array<{ key: K, value: V[K] }> {
    if (typeof amount != 'number') new DatabaseError({ expected: 'number', received: typeof amount });

    const obj: Record<K, V[K]> = this.json();

    let results: Array<{ key: K, value: V[K] }> = [];
    for (const key in obj) results.push({ key, value: obj[key] });

    if (amount > 0) results = results.splice(0, amount);

    return results;
  };

  public array(): { keys: Array<string>, values: Array<any> } {
    return this.options.driver.array();
  };

  public add<K extends keyof V>(key: K, amount: number = 1, negative: boolean = false): number {
    return this.math(key, '+', amount, negative);
  };

  public clone(path?: string): void {
    return this.options.driver.clone(path);
  };

  public del<K extends keyof V>(key: K): boolean {
    // @ts-ignore
    const parsed: boolean = this.options.driver.delete(key, this.options.autoWrite);
    if (parsed) this.size--;

    return parsed;
  };

  public every<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (!(callback(value, key, index, this))) return false;
    };

    return true;
  };

  public exists<K extends keyof V>(key: K): boolean {
    // @ts-ignore
    return this.options.driver.has(key);
  };

  public filter<K extends keyof V>(callback: Function): Database<V> {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) db.set(key, value);
    };

    return db;
  };

  public find<K extends keyof V>(callback: Function): boolean | V[K] {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    let collected: boolean = false;

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; (!collected && index < data.length); index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) {
        collected = true;
        return value;
      };
    };

    return false;
  };

  public findUpdate<K extends keyof V>(newValue: V[K], callback: Function): boolean {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    let updated: boolean = false;

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) {
        if (this.set(key, newValue)) updated = true;
      };
    };

    return updated;
  };

  public findDelete<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    let deleted: boolean = false;

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) deleted = this.del(key);
    };

    return deleted;
  };

  public get<K extends keyof V>(key: K): V[K] | undefined {
    // @ts-ignore
    return this.options.driver.get(key);
  };

  public has<K extends keyof V>(key: K): boolean {
    return this.exists(key);
  };

  public set<K extends keyof V>(key: K, value?: V[K]): V[K] | undefined {
    if (this.options.size != 0 && (this.size > this.options.size)) throw new RangeError('Database limit exceeded.');

    // @ts-ignore
    const parsed: V[K] = this.options.driver.set(key, value, this.options.autoWrite);
    if (parsed) this.size++;

    return value;
  };

  public sub<K extends keyof V>(key: K, amount: number = 1, negative: boolean = false): number {
    return this.math(key, '-', amount, negative);
  };

  public search<K extends keyof V>(callback: Function): Array<{ key: K, value: V[K] }> {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const collected: Array<{ key: K, value: V[K] }> = [];

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) collected.push({ key, value });
    };

    return collected;
  };

  public some<K extends keyof V>(callback: Function): boolean {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

      if (callback(value, key, index, this)) return true;
    };

    return false;
  };

  public json<K extends keyof V>(): Record<K, V[K]> {
    // @ts-ignore
    return this.options.driver.json();
  };

  public type<K extends keyof V>(key: K): string {
    const data: V[K] | undefined = this.get(key);

    let __type;
    if (Array.isArray(data)) __type = 'array';
    else __type = typeof data;

    return __type;
  };

  public math<K extends keyof V>(key: K, operator: MathOperations, count: number, negative: boolean = false): number {
    if (typeof operator != 'string') new DatabaseError({ expected: 'string', received: typeof operator });
    if (typeof count != 'number') new DatabaseError({ expected: 'number', received: typeof count });

    // @ts-ignore
    if (!this.exists(key)) this.set(key, 0);

    const data: any = this.get(key);
    if (typeof data != 'number') new DatabaseError({ expected: 'number', received: typeof data });

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

  public map<K extends keyof V>(callback: Function): Database<V> {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const db: Database<V> = new Database<V>(this.options);

    const data: Array<{ key: K, value: V[K] }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value } = data[index];

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
      else this.set(key, [...data, ...values]);
      // @ts-ignore
    } else this.set(key, values);

    return void 0;
  };

  public pull<K extends keyof V>(key: K, callback: Function): V[K] | undefined | null {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    if (!this.exists(key)) return null;

    const data = this.get(key);
    if (!Array.isArray(data)) throw new TypeError(`'data' must be an array.`);

    let result: Array<V[K]> = [];
    for (let index: number = 0; index < data.length; index++) {
      const value: V[K] = data[index];

      if (!callback(value, index, this)) result.push(value);
    };

    // @ts-ignore
    return this.set(key, result);
  };

  public ping(callback: Function = __ping): PingResult {
    if (typeof callback != 'function') new DatabaseError({ expected: 'function', received: typeof callback });

    const version: number = Number((process.version.split('v'))[0]);
    const runfn = (version > 15) ? performance.now : Date.now;

    const random: string = (Math.floor(Math.random() * 100)).toString();

    const setStart: number = runfn();
    // @ts-ignore
    this.set(random, 0);
    const setEnd: number = runfn();

    const getStart: number = runfn();
    // @ts-ignore
    this.get(random);
    const getEnd: number = runfn();

    const delStart: number = runfn();
    // @ts-ignore
    this.del(random);
    const delEnd: number = runfn();

    let set: string | number = (setEnd - setStart);
    let get: string | number = (getEnd - getStart);
    let del: string | number = (delEnd - delStart);
    let average: string = (((set + get + del) / 3).toFixed(2)).concat('ms');

    set = (set.toFixed(2)).concat('ms');
    get = (get.toFixed(2)).concat('ms');
    del = (del.toFixed(2)).concat('ms');

    const results = { from: ((((this.options.driver.constructor.name).split('Driver'))[0]).toLowerCase()), set, get, del, average };

    callback(results);

    return results;
  };

  static concat(databases: Array<Database>, options: DatabaseOptions): Database {
    if (!Array.isArray(databases)) new DatabaseError({ expected: 'array', received: typeof databases });
    if (typeof options != 'object') new DatabaseError({ expected: 'object', received: typeof options });

    const db: Database = new Database(options);

    for (const database of databases) {
      const data: Array<{ key: string, value: any }> = database.all();
      for (const { key, value } of data) db.set(key, value);
    };

    return db;
  };

  static checkOptions(options: DatabaseOptions): void {
    if (typeof options != 'object') new DatabaseError({ expected: 'object', received: typeof options });

    options.autoWrite ??= DatabaseDefaultOptions.autoWrite;
    options.overWrite ??= DatabaseDefaultOptions.overWrite;
    options.size ??= DatabaseDefaultOptions.size;
    options.spaces ??= DatabaseDefaultOptions.spaces;
    options.driver ??= DatabaseDefaultOptions.driver;

    if (!(options?.driver instanceof Drivers.Driver)) new DatabaseError({ message: 'Invalid database driver.' });
    if (typeof options?.autoWrite != 'boolean') new DatabaseError({ expected: 'boolean', received: typeof options?.autoWrite });
    if (typeof options?.overWrite != 'boolean') new DatabaseError({ expected: 'boolean', received: typeof options?.overWrite });
    if (typeof options?.size != 'number') new DatabaseError({ expected: 'number', received: typeof options?.size });
    if (typeof options?.spaces != 'number') new DatabaseError({ expected: 'number', received: typeof options?.spaces });
  };

  static readonly Drivers = Drivers;
  static readonly version = version;
};