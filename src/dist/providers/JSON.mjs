import { s } from '@sapphire/shapeshift';
import graceful from 'graceful-fs';

export default class JSONProvider {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = `${process.cwd()}/database.json`, spaces = 2) {
    s.string.parse(path);
    s.number.parse(spaces);

    if (!path.endsWith('.json')) path += '.json';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    /**
     * @type typeof spaces
     * @private
     */
    this.spaces = spaces;

    if (!graceful.existsSync(this.path)) graceful.writeFileSync(this.path, JSON.stringify({}));
  };

  /**
   * Write database file.
   * @param {{}} data 
   * @returns {void}
   */
  write(data) {
    s.object(data).required;

    const parsed = JSON.stringify(data, null, this.spaces);

    graceful.writeFileSync(this.path, parsed);

    return void 0;
  };

  /**
   * Read database file.
   * @returns {string}
   */
  read() {
    const data = graceful.readFileSync(this.path, { encoding: 'utf8' });

    return data;
  };

  /**
   * Convert database file to Object.
   * @returns {{}}
   */
  toJSON() {
    return (JSON.parse(this.read()));
  };
};