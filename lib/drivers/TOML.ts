import Driver from './Base';
import toml from '@iarna/toml';

export default class TOMLDriver extends Driver {
  public constructor(path?: string, name?: string) {
    super(path, name, '.toml');

    Driver.write(this.path, toml.stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    // @ts-ignore
    return super.clone(path, toml.stringify(this.json()));
  };

  public override save(): void {
    // @ts-ignore
    return super.save(toml.stringify(this.json()), 'utf8');
  };

  public override read(): void {
    return super.read(toml.parse, 'utf8');
  };
};