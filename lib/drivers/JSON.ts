import Driver from './Base';

export default class JSONDriver extends Driver {
  private readonly spaces: number;

  public constructor(path?: string, name?: string, spaces: number = 2) {
    super(path, name, '.json');

    this.spaces = spaces;

    Driver.write(this.path, JSON.stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, JSON.stringify(this.json(), null, this.spaces));
  };

  public override save(): void {    
    return super.save(JSON.stringify(this.json(), null, this.spaces), 'utf8');
  };

  public override read(): void {
    return super.read(JSON.parse, 'utf8');
  };
};