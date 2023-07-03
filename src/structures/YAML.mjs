import { s } from '@sapphire/shapeshift';
import graceful from 'graceful-fs';
import YAML from 'yaml';

export default class YAMLDriver {
  /**
   * Create new YAML-Based database.
   * @param {string} path 
   */
  constructor(path = 'database.yaml') {
    s.string.parse(path);

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.yaml')) path += '.yaml';

    /**
     * @type typeof path
     * @private
     */
    this.path = path;

    const seperators = path.split('/');
    let __path = '';
    for (let index = 0; index < (seperators.length - 1); index++) {
      __path += `${seperators[index]}/`;

      if (graceful.existsSync(__path)) continue;

      graceful.mkdirSync(__path);
    };

    if (!graceful.existsSync(this.path)) this.write();
    else this.save();
  };

  /**
   * Database cache.
   * @readonly
   */
  cache = {};

  /**
   * Write database file.
   * @param {unknown} data 
   * @returns {void}
   */
  write() {
    graceful.writeFileSync(this.path, YAML.stringify(this.cache), { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Save file to cache.
   * @returns {void}
   */
  save() {
    const data = graceful.readFileSync(this.path, { encoding: 'utf8' });

    this.cache = JSON.parse(JSON.stringify(YAML.parse(data) ?? {}, null, 2));

    return void 0;
  };
};