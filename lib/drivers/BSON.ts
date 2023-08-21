import Driver from './Base';
import bson from 'bson';

export default class BSONDriver extends Driver {
  public constructor(path?: string, name?: string) {
    super(path, name, '.bson');

    Driver.write(this.path, bson.serialize({}), 'binary');
    this.read();
  };

  public override clone(path?: string): void {
    return super.clone(path, bson.serialize(this.json()));
  };

  public override save(): void {
    return super.save(bson.serialize(this.json()), 'binary');
  };

  public override read(): void {
    return super.read(bson.deserialize);
  };
};