import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { platform as _platform } from 'node:os';

import { DriverOptions, DriverDefaultOptions } from '../interfaces/DriverOptions';

export class Driver<V = any> extends Map<string, V> {
  public readonly options: DriverOptions;

  public constructor(options: DriverOptions = DriverDefaultOptions) {
    Driver.checkOptions(options);

    super();

    const platform = _platform();

    // @ts-ignore
    const _path: string = options.path.substring(0, options.path.lastIndexOf(platform != 'win32' ? '/' : '\\'));
    if (!existsSync(_path)) mkdirSync(_path, { recursive: true });

    if (options.name) options.path += (platform != 'win32' ? `/${options.name}` : `\\${options.name}`);
    // @ts-ignore
    if (!options.useHexEncoding && !options.path.endsWith('.json')) options.path += '.json';
    // @ts-ignore
    else if (options.useHexEncoding && !options.path.endsWith('.vstore')) options.path += '.vstore';
    // @ts-ignore
    Driver.write(options.path, options);

    this.options = options;

    if (!this.options?.useOldSaveMethod) process.on('beforeExit', () => this.save());
  };
  // @ts-ignore
  public override set(key: string, value: V): V {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');
    if (value === void 0) throw new ReferenceError('\'value\' cannot be empty.');

    super.set(key, value);
    if (this.options?.useOldSaveMethod) this.save();

    return value;
  };

  public override get(key: string): V | undefined {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.get(key);
  };

  public override has(key: string): boolean {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.has(key);
  };

  public override delete(key: string): boolean {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    const state: boolean = super.delete(key);
    if (this.options?.useOldSaveMethod) this.save();

    return state;
  };

  protected save(data: Record<string, V> = this.json()): void {
    const _ecode: string = JSON.stringify(data, null, this.options.spaces);
    // @ts-ignore
    return writeFileSync(this.options.path, this.options.useHexEncoding ? Driver.encode(_ecode) : _ecode, { encoding: 'utf8' });
  };

  protected read(): void {
    // @ts-ignore
    const data: string = readFileSync(this.options.path, { encoding: 'utf8' });

    const handled: Record<string, V> = JSON.parse(this.options.useHexEncoding ? Driver.encode(data) : data);
    for (const key in handled) super.set(key, handled[key]);

    return void 0;
  };

  public json(): Record<string, V> {
    const obj: Record<string, V> = {};

    for (const [key, value] of this) Driver.set(obj, key, value);

    return obj;
  };

  public array(): { keys: Array<string>, values: Array<V> } {
    const data: Record<string, V> = this.json();

    const array: [Array<string>, Array<V>] = [[], []];

    for (const key in data) {
      array[0].push(key);
      array[1].push(data[key]);
    };

    return { keys: array[0], values: array[1] };
  };

  protected static encode(text: string): string {
    if (typeof text != 'string') throw new TypeError('\'text\' is not string.');

    return (Buffer.from(text, 'utf8')).toString('hex');
  };

  protected static decode(text: string): string {
    if (typeof text != 'string') throw new TypeError('\'text\' is not string.');

    return (Buffer.from(text, 'hex')).toString('utf8');
  };

  protected static set(object: Record<string, any>, path: string, value?: any): Record<string, any> {
    if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
    if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < (keys.length - 1); index++) {
      const key: string = keys[index];

      if (!Object.hasOwn(object, key)) object[key] = {};

      object = object[key];
    };

    object[keys[keys.length - 1]] = value;

    return object;
  };

  protected static get(object: Record<string, any>, path: string): Record<string, any> | undefined {
    if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
    if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < keys.length; index++) {
      const key = keys[index];

      if (Object.hasOwn(object, key)) object = object[key];
      else return undefined;
    };

    return object;
  };

  protected static has(object: Record<string, any>, path: string): boolean {
    if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
    if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < keys.length; index++) {
      const key: string = keys[index];

      if (Object.hasOwn(object, key)) object = object[key];
      else return false;
    };

    return true;
  };

  protected static unset(object: Record<string, any>, path: string): boolean {
    if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
    if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

    const keys: Array<string> = path.split('.');

    for (let index: number = 0; index < (keys.length - 1); index++) {
      const key: string = keys[index];

      if (!Object.hasOwn(object, key)) return false;

      object = object[key];
    };

    delete object[keys[keys.length - 1]];

    return true;
  };

  protected static write(path: string, options: DriverOptions): void {
    if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

    let data: string;
    if (options?.useHexEncoding) data = this.encode('{}');
    else data = JSON.stringify({}, null, options.spaces);

    if (existsSync(path)) return void 0;
    else return writeFileSync(path, data, { encoding: 'utf8' });
  };

  static checkOptions(options: DriverOptions): DriverOptions {
    if (typeof options != 'object') throw new TypeError('\'object\' is not object.');

    options.name ??= DriverDefaultOptions.name;
    options.path ??= DriverDefaultOptions.path;
    options.useOldSaveMethod ??= DriverDefaultOptions.useOldSaveMethod;
    options.useHexEncoding ??= DriverDefaultOptions.useHexEncoding;

    if (typeof options?.name != 'string') throw new TypeError('\'options.name\' is not string.');
    if (typeof options?.path != 'string') throw new TypeError('\'options.path\' is not string.');
    if (typeof options?.useOldSaveMethod != 'boolean') throw new TypeError('\'options.useOldSaveMethod\' is not boolean.');
    if (typeof options?.useHexEncoding != 'boolean') throw new TypeError('\'options.useHexEncoding\' is not boolean.');

    return options;
  };
};

export default Driver;
export { DriverOptions } from '../interfaces/DriverOptions';