import Driver, { DriverOptions } from './Driver';
import { serialize, deserialize } from 'bson';

export class BSON extends Driver {
  public constructor(options?: DriverOptions) {
    super(options);

    if (this.options?.experimentalFeatures) process.on('beforeExit', () => this.save());

    // @ts-ignore
    Driver.write(this.options.path, serialize({}), 'binary');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, serialize(this.json()));
  };

  public override save(): void {
    return super.save(serialize(this.json()), 'binary');
  };

  public override read(): void {
    return super.read(deserialize);
  };
};