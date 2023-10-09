import Database from 'client/Database';
import DatabaseManagerOptions, { DatabaseManagerOptionsBase, DatabaseManagerOptionsDefault } from 'interfaces/DatabaseManagerOptions';

let notified: boolean = false;
export default class DatabaseManager extends Map<string, Database> {
  protected readonly options: DatabaseManagerOptionsBase;

  public constructor(options?: DatabaseManagerOptions) {
    super();

    this.options = DatabaseManager.checkOptions(options);

    if (!this.options.disableExperimentalNotification && !notified) {
      notified = !notified;

      console.info('\'DatabaseManager\' is experimental feature, some features may not work.');
    };
  };

  public assign(manager: DatabaseManager): Readonly<Record<string, boolean>> {
    if (!(manager instanceof DatabaseManager)) throw new TypeError('\'manager\' is not DatabaseManager.');

    const obj: Record<string, boolean> = {};

    const data: Array<{ key: string, value: Database }> = this.all();
    for (const key in data) {
      try {
        // @ts-ignore
        manager.set(key, data[key]);
        Object.defineProperty(obj, key, { value: true, writable: false, configurable: false, enumerable: true });
      } catch (error) {
        console.log(new Error(`AssignError: ${error}`));
        Object.defineProperty(obj, key, { value: false, writable: false, configurable: false, enumerable: true });
      };
    };

    return obj;
  };

  public at(keyIndex?: number, valueIndex?: number): { key: string | undefined, value: Database | undefined } {
    if (keyIndex && typeof keyIndex != 'number') throw new TypeError('\'keyIndex\' is not number.');
    if (valueIndex && typeof valueIndex != 'number') throw new TypeError('\'valueIndex\' is not number.');

    const array = this.array();

    const key: string | undefined = keyIndex ? array.keys().at(keyIndex) : undefined;
    const value: Database | undefined = valueIndex ? array.values().at(valueIndex) : undefined;

    return { key, value };
  };

  public all(amount: number = 0): Array<{ key: string, value: Database }> {
    if (typeof amount != 'number') throw new TypeError('\'amount\' is not number.');

    const obj: Record<string, any> = this.json();

    let results: Array<{ key: string, value: Database }> = [];
    // @ts-ignore
    for (const key in obj) results.push({ key, value: obj[key] });

    if (amount > 0) results = results.slice(0, amount);

    return results;
  };

  public array(): { keys: () => Array<string>, values: () => Array<Database> } {
    const data: Record<string, any> = this.json();

    const keys: Function = (): Array<string> => {
      const _keys: Array<string> = [];

      for (const key in data) _keys.push(key);

      return _keys;
    };

    const values: Function = (): Array<Database> => {
      const _values: Array<Database> = [];

      for (const key in data) _values.push(data[key]);

      return _values;
    };
    // @ts-ignore
    return { keys, values };
  };

  public concat(...managers: Array<DatabaseManager>): DatabaseManager {
    if (!Array.isArray(managers)) throw new TypeError('\'managers\' is not array.');
    if (managers.length < 1) throw new RangeError('\'managers\' cant be less than 1.');

    managers.unshift(this);

    const mgr: DatabaseManager = new DatabaseManager(this.options);
    for (const manager of managers) {
      const data: Array<{ key: string, value: Database }> = manager.all();

      for (const { key, value } of data) mgr.set(key, value);
    };

    return mgr;
  };

  public each(callback: Function): void {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      callback(value, key, index, this);
    };

    return void 0;
  };

  public exists(key: string): boolean {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.has(key);
  };

  public filter(callback: Function): DatabaseManager {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const mgr: DatabaseManager = new DatabaseManager(this.options);

    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      if (callback(value, key, index, this)) mgr.set(key, value);
    };

    return mgr;
  };

  public find(callback: Function): Database | undefined {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      if (callback(value, key, index, this)) return value;
    };

    return undefined;
  };

  public override get(key: string): Database | undefined {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');

    return super.get(key);
  };

  public override has(key: string): boolean {
    return this.exists(key);
  };
  // @ts-ignore
  public override set(key: string, value: Database): Database {
    if (typeof key != 'string') throw new TypeError('\'key\' is not string.');
    if (!((value as any) instanceof Database)) throw new TypeError('\'value\' is not Database.');

    super.set(key, value);

    return value;
  };

  public search(callback: Function): Array<{ key: string, value: Database }> {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const collected: Array<{ key: string, value: Database }> = [];
    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      if (callback(value, key, index, this)) collected.push({ key, value });
    };

    return collected;
  };

  public some(callback: Function): boolean {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      if (callback(value, key, index, this)) return true;
    };

    return false;
  };

  public json(): Record<string, any> {
    const obj: Record<string, any> = {};

    for (const [key, value] of this) obj[key] = value;

    return obj;
  };

  public map(callback: Function): DatabaseManager {
    if (typeof callback != 'function') throw new TypeError('\'callback\' is not function.');

    const mgr: DatabaseManager = new DatabaseManager(this.options);

    const data: Array<{ key: string, value: Database }> = this.all();
    for (let index: number = 0; index < data.length; index++) {
      const { key, value }: { key: string, value: Database } = data[index];

      if (callback(value, key, index, this)) mgr.set(key, value);
    };

    return mgr;
  };

  static checkOptions(options?: DatabaseManagerOptions): DatabaseManagerOptionsBase {
    options ??= DatabaseManagerOptionsDefault;
    if (typeof options != 'object') throw new TypeError('\'options\' is not object.');

    options.size ??= DatabaseManagerOptionsDefault.size;
    options.disableExperimentalNotification ??= DatabaseManagerOptionsDefault.disableExperimentalNotification;

    return options as DatabaseManagerOptionsBase;
  };
};