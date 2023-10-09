import { writeFileSync } from 'node:fs';

import Driver from 'drivers/Driver';

import DataMap from 'interfaces/DataMap';
import DataSignature from 'interfaces/DataSignature';
import DriverOptions from 'interfaces/DriverOptions';
import DataRecord from 'interfaces/DataRecord';

let bson: any;
try {
  bson = require('bson');
} catch (e: unknown) {};

export class BSONDriver<V extends DataSignature<V> = DataMap> extends Driver<V> {
  public constructor(options?: DriverOptions) {
    if (!bson) throw new ReferenceError('To use this driver you need to install the \'bson\' module.');

    super({ ...options, type: 'auto' });
  };

  protected read(): void {
    const obj: DataRecord<V> = bson.deserialize(require(this.options.path as string));

    for (const key in obj) super.set(key, obj[key]);

    return void obj;
  };

  protected write(): void {
    const obj: DataRecord<V> = this.json();

    writeFileSync(this.options.path as string, Buffer.from(bson.serialize(obj)), { encoding: 'binary' });

    return void obj;
  };
};

export default BSONDriver;