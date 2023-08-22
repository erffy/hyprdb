import Driver, { DriverOptions, DriverDefaultOptions } from './Driver';

export class JSONDriver extends Driver {
  public constructor(options: DriverOptions = DriverDefaultOptions) {
    super({ type: 'json', ...options });

    if (this.options?.experimentalFeatures) process.on('beforeExit', () => this.save());

    // @ts-ignore
    Driver.write(this.options.path, JSON.stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, JSON.stringify(this.json(), null, this.options.spaces));
  };

  public override save(): void {    
    return super.save(JSON.stringify(this.json(), null, this.options.spaces), 'utf8');
  };

  public override read(): void {
    return super.read(JSON.parse, 'utf8');
  };
};