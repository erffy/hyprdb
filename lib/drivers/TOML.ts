import Driver, { DriverOptions } from './Driver';
import { stringify, parse } from '@iarna/toml';

export class TOML extends Driver {
  public constructor(options?: DriverOptions) {
    super(options);

    if (this.options?.experimentalFeatures) process.on('beforeExit', () => this.save());

    // @ts-ignore
    Driver.write(this.options.path, stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    // @ts-ignore
    return super.clone(path, stringify(this.json()));
  };

  public override save(): void {
    // @ts-ignore
    return super.save(stringify(this.json()), 'utf8');
  };

  public override read(): void {
    return super.read(parse, 'utf8');
  };
};