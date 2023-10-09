import { writeFileSync } from 'node:fs';

import Driver from 'drivers/Driver';

import DataMap from 'interfaces/DataMap';
import DataSignature from 'interfaces/DataSignature';
import DriverOptions from 'interfaces/DriverOptions';
import DataRecord from 'interfaces/DataRecord';

export class JSONDriver<V extends DataSignature<V> = DataMap> extends Driver<V> {
  public constructor(options?: DriverOptions) {
    super({ ...options, type: 'auto' });
  };

  protected read(): void {
    const obj: DataRecord<V> = require(this.options.path as string);

    for (const key in obj) super.set(key, obj[key]);

    return void obj;
  };

  protected write(): void {
    const obj: DataRecord<V> = this.json();

    writeFileSync(this.options.path as string, Buffer.from(JSON.stringify(obj, null, this.options.spaces)), { encoding: 'binary' });

    return void obj;
  };
};

export default JSONDriver;