import Driver from './Base';
import * as JSON5 from 'json5';

export default class JSON5Driver extends Driver {
  private readonly spaces: number;
  
  public constructor(path?: string, name?: string, spaces: number = 2) {
    super(path, name, '.json5');

    this.spaces = spaces;

    Driver.write(this.path, JSON5.stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, JSON5.stringify(this.json(), null, this.spaces));
  };

  public override save(): void {
    return super.save(JSON5.stringify(this.json(), null, this.spaces), 'utf8');
  };

  public override read(): void {
    return super.read(JSON5.parse, 'utf8');
  };
};