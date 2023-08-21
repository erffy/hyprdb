import Driver from './Base';
import ini from 'ini';

export default class INIDriver extends Driver {
  public constructor(path?: string, name?: string) {
    super(path, name, '.ini');

    Driver.write(this.path, ini.stringify({}), 'utf8');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, ini.stringify(this.json()));
  };

  public override save(): void {
    return super.save(ini.stringify(this.json()), 'utf8');
  };

  public override read(): void {
    return super.read(ini.parse, 'utf8');
  };
};