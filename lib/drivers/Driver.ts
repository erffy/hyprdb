import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'graceful-fs';
import { platform as _platform } from 'node:os';

import DatabaseError from '../database/DatabaseError';

import { DatabaseSignature } from '../interfaces/DatabaseSignature';
import { DatabaseMap } from '../interfaces/DatabaseMap';
import { DriverOptions, DriverDefaultOptions } from '../interfaces/DriverOptions';

export class Driver<V extends DatabaseSignature<V> = DatabaseMap> extends Map {
  protected readonly options: DriverOptions;

  public constructor(options: DriverOptions = DriverDefaultOptions) {
    super();

    const platform = _platform();

    options.type ??= this.constructor.name.toLowerCase();
    Driver.checkOptions(options);

    // @ts-ignore
    const __path: string = options.path.substring(0, options.path.lastIndexOf(platform != 'win32' ? '/' : '\\'));
    if (!existsSync(__path)) mkdirSync(__path, { recursive: true });

    if (options.name) options.path += (platform != 'win32' ? `/${options.name}` : `\\${options.name}`);
    // @ts-ignore
    if (!options.path.endsWith(options.type)) options.path += options.type;
    
    this.options = options;
  };

  public override set<K extends keyof V>(key: K, value: V[K], autoWrite: boolean = true): V[K] {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });
    if (typeof autoWrite != 'boolean') new DatabaseError({ expected: 'boolean', received: typeof autoWrite });

    super.set(key, value);
    if (autoWrite && !this.options?.experimentalFeatures) this.save();

    return value;
  };

  public override get<K extends keyof V>(key: K): V[K] | undefined {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });

    return super.get(key);
  };

  public override has<K extends keyof V>(key: K): boolean {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });

    return super.has(key);
  };

  public override delete<K extends keyof V>(key: K, autoWrite: boolean = true): boolean {
    if (typeof key != 'string') new DatabaseError({ expected: 'string', received: typeof key });
    if (typeof autoWrite != 'boolean') new DatabaseError({ expected: 'boolean', received: typeof autoWrite });

    const state: boolean = super.delete(key);
    if (autoWrite) this.save();

    return state;
  };

  public clone(path: string = `${this.options.path}-clone.${this.options.type}`, bind?: any, encoding?: BufferEncoding): void {
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });
    if (path.length < 1) throw new RangeError(`'${path}' is not valid path.`);

    const __path: string = path.substring(0, path.lastIndexOf('/'));
    if (__path.length > 0 && !existsSync(__path)) mkdirSync(__path, { recursive: true });

    return writeFileSync(path, bind, { encoding });
  };

  public save(data?: any, encoding?: BufferEncoding): void {
    // @ts-ignore
    return writeFileSync(this.options.path, Buffer.from(data), { encoding });
  };

  public read(handler: (data: any) => Record<string, any>, encoding?: BufferEncoding): void {
    if (typeof handler != 'function') new DatabaseError({ expected: 'function', received: typeof handler });

    // @ts-ignore
    let data: Buffer | string = readFileSync(this.options.path, { encoding });
    data ??= '{}'; 

    const handled: Record<string, any> = handler(data);
    for (const key in handled) super.set(key, handled[key]);

    return void 0;
  };

  public json<K extends keyof V>(): Record<K, V[K]> {
    const obj: Record<any, V[K]> = {};

    for (const [key, value] of this) Driver.set(obj, key, value);

    return obj;
  };

  public array(): { keys: Array<string>, values: Array<any> } {
    const data: Record<string, any> = this.json();

    const array: [Array<string>, Array<any>] = [[], []];

    for (const key in data) {
      array[0].push(key);
      array[1].push(data[key]);
    };

    return { keys: array[0], values: array[1] };
  };

  static set(object: Record<string, any>, path: string, value?: any): Record<string, any> {
    if (typeof object != 'object') new DatabaseError({ expected: 'object', received: typeof object });
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < (keys.length - 1); index++) {
      const key: string = keys[index];

      if (!object[key]) object[key] = {};

      object = object[key];
    };

    object[keys[keys.length - 1]] = value;

    return object;
  };

  static get(object: Record<string, any>, path: string): Record<string, any> | undefined {
    if (typeof object != 'object') new DatabaseError({ expected: 'object', received: typeof object });
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < keys.length; index++) {
      const key = keys[index];

      if (object[key]) object = object[key];
      else return undefined;
    };

    return object;
  };

  static has(object: Record<string, any>, path: string): boolean {
    if (typeof object != 'object') new DatabaseError({ expected: 'object', received: typeof object });
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < keys.length; index++) {
      const key: string = keys[index];

      if (object[key]) object = object[key];
      else return false;
    };

    return true;
  };

  static merge(object: Record<string, any>, source: object): Record<string, any> {
    if (typeof object != 'object') new DatabaseError({ expected: 'object', received: typeof object });
    if (typeof source != 'object') new DatabaseError({ expected: 'object', received: typeof source });

    for (const key in source) {
      // @ts-ignore
      if (typeof source[key] === 'object' && typeof object[key] === 'object') Driver.merge(object[key], source[key]);
      // @ts-ignore
      else object[key] = source[key];
    };

    return object;
  };

  static unset(object: Record<string, any>, path: string): boolean {
    if (typeof object != 'object') new DatabaseError({ expected: 'object', received: typeof object });
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < (keys.length - 1); index++) {
      const key: string = keys[index];

      if (!object[key]) return false;

      object = object[key];
    };

    delete object[keys[keys.length - 1]];

    return true;
  };

  static write(path: string, data?: any, encoding?: BufferEncoding): void {
    if (typeof path != 'string') new DatabaseError({ expected: 'string', received: typeof path });

    if (existsSync(path)) return void 0;
    else return writeFileSync(path, data, { encoding });
  };

  static checkOptions(options: DriverOptions) {
    if (typeof options != 'object') new DatabaseError({ expected: 'object', received: typeof options });

    options.name ??= DriverDefaultOptions.name;
    options.path ??= DriverDefaultOptions.path;
    options.experimentalFeatures ??= DriverDefaultOptions.experimentalFeatures;

    if (typeof options?.name != 'string') new DatabaseError({ expected: 'string', received: typeof options?.name });
    if (typeof options?.type != 'string') new DatabaseError({ expected: 'string', received: typeof options?.type });
    if (typeof options?.path != 'string') new DatabaseError({ expected: 'string', received: typeof options?.path });
    if (typeof options?.experimentalFeatures != 'boolean') new DatabaseError({ expected: 'string', received: typeof options?.experimentalFeatures });

    return options;
  };
};

export default Driver;
export * from '../interfaces/DriverOptions';