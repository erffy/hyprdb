import Driver, { DriverOptions, DriverDefaultOptions } from './Driver';
import { stringify, parse } from 'json5';

export class JSON5 extends Driver {  
  public constructor(options?: DriverOptions) {
    super(options);

    if (this.options?.experimentalFeatures) process.on('beforeExit', () => this.save());

    // @ts-ignore
    Driver.write(this.options.path, stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, stringify(this.json(), null, this.options.spaces));
  };

  public override save(): void {
    return super.save(stringify(this.json(), null, this.options.spaces), 'utf8');
  };

  public override read(): void {
    return super.read(parse, 'utf8');
  };
};