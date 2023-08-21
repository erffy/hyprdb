import Driver from './Base';
import yaml from 'js-yaml';

export default class YAMLDriver extends Driver {
  public constructor(path?: string, name?: string) {
    super(path, name, '.yaml');

    Driver.write(this.path, yaml.load(JSON.stringify({})), 'utf8');
    this.read();
  };
  
  public override clone(path?: string): void {
    return super.clone(path, yaml.load(JSON.stringify(this.json())));
  };
  
  public override save(): void {
    return super.save(yaml.dump(this.json()), 'utf8');
  };

  public override read(): void {
    // @ts-ignore
    return super.read(yaml.load, 'utf8');
  };
};