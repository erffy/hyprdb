import Driver, { DriverOptions } from './Driver';
import { load, dump } from 'js-yaml';

export class YAML extends Driver {
  public constructor(options?: DriverOptions) {
    super(options);

    if (this.options?.experimentalFeatures) process.on('beforeExit', () => this.save());

    // @ts-ignore
    Driver.write(this.options.path, load(JSON.stringify({})), 'utf8');
    this.read();
  };
  
  public override clone(path?: string): void {
    return super.clone(path, load(JSON.stringify(this.json())));
  };
  
  public override save(): void {
    return super.save(dump(this.json()), 'utf8');
  };

  public override read(): void {
    // @ts-ignore
    return super.read(load, 'utf8');
  };
};