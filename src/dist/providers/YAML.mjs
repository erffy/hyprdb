import { s } from '@sapphire/shapeshift';
import graceful from 'graceful-fs';
import YAML from 'yaml';

export default class YAMLProvider {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   */
  constructor(path = `${process.cwd()}/database.yaml`) {
    s.string.parse(path);

    if (!path.endsWith('.yaml')) path += '.yaml';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    if (!graceful.existsSync(this.path)) graceful.writeFileSync(this.path, YAML.stringify({}));
  };
// JSON a düzgün çeviremiyordu yani
  /**
   * Write database file.
   * @param {unknown} data 
   * @returns {void}
   */
  write(data = {}) {
    graceful.writeFileSync(this.path, YAML.stringify(data));

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
    const data = this.read();
    return (JSON.parse(JSON.stringify(YAML.parse(data) ?? {})));
  };
};