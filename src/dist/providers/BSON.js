import { s } from '@sapphire/shapeshift';
import graceful from 'graceful-fs';
import * as BSON from 'bson';

export default class BSONProvider {
  /**
   * Create new Binary-Based database.
   * @param {string} path
   * @constructor 
   */
  constructor(path = `${process.cwd()}/database.bson`) {
    s.string.parse(path);

    if (!path.endsWith('.bson')) path += '.bson';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    if (!graceful.existsSync(this.path)) this.write({ name: 'nova.db' });
  };

  /**
   * Write database file.
   * @param {{}} data 
   * @returns {void}
   */
  write(data) {
    s.object(data).required;

    graceful.writeFileSync(this.path, `${BSON.serialize(data)}`, { encoding: 'binary' });

    return void 0;
  };

  /**
   * Read database file.
   * @returns {Buffer}
   */
  read() {
    const data = graceful.readFileSync(this.path);

    return data;
  };

  /**
   * Convert database file to Object.
   * @returns {{}}
   */
  toJSON() {
    return (BSON.deserialize(this.read()));
  };
};