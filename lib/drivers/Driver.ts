import { existsSync, mkdirSync, statSync } from 'node:fs';

import { DriverOptions, DriverOptionsDefault } from 'interfaces/DriverOptions';

import DataMap from 'interfaces/DataMap';
import DataRecord from 'interfaces/DataRecord';
import DataSignature from 'interfaces/DataSignature';

import _set from 'functions/set';
import _next from 'functions/nextClone';

export abstract class Driver<V extends DataSignature<V> = DataMap> extends Map<keyof V, V[keyof V]> {
  protected readonly options: DriverOptions;

  protected constructor(options: DriverOptions = DriverOptionsDefault) {
    super();

    this.options = Driver.checkOptions(options);
    // @ts-ignore
    if (this.options.type === 'auto') this.options.type = this.constructor.name.split('Driver').at(0).toLowerCase();

    // @ts-ignore
    const _path: string = options.path.substring(0, options.path.lastIndexOf(process.platform != 'win32' ? '/' : '\\'));

    if (!existsSync(_path)) mkdirSync(_path, { recursive: true });
    if (!statSync(this.options.path as string).isFile()) this.options.path += `${process.platform === 'win32' ? '\\' : '/'}${this.options.name}.${this.options.type}`;
    else this.options.path += `${process.platform === 'win32' ? '\\' : '/'}${_next(this.options)}`;
    
    process.on('beforeExit', this.write);
  };

  protected abstract read(): void;
  protected abstract write(): void;

  public override set<K extends keyof V>(key: K, value: V[K]): V[K] {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');
    if (value === void 0) throw new ReferenceError('\'value\' cannot be empty.');

    super.set(key, value);

    return value;
  };

  public override get<K extends keyof V>(key: K): V[K] | undefined {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.get(key);
  };

  public override has<K extends keyof V>(key: K): boolean {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.has(key);
  };

  public override delete<K extends keyof V>(key: K): boolean {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.delete(key);
  };

  public json(): DataRecord<V> {
    // @ts-ignore
    const obj: DataRecord<V> = {};

    for (const [key, value] of this) _set(obj, key as string, value);

    return obj;
  };

  static checkOptions(options?: DriverOptions): DriverOptions {
    options ??= DriverOptionsDefault;
    if (typeof options != 'object') throw new TypeError('\'object\' is not object.');

    options.name ??= DriverOptionsDefault.name;
    options.path ??= DriverOptionsDefault.path;
    options.type ??= DriverOptionsDefault.type;

    if (typeof options.name != 'string') throw new TypeError('\'options.name\' is not string.');
    if (typeof options.path != 'string') throw new TypeError('\'options.path\' is not string.');
    if (typeof options.type != 'string') throw new TypeError('\'options.type\' is not string.');

    return options;
  };
};

export default Driver;