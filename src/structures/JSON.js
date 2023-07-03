const { s } = require('@sapphire/shapeshift');
const graceful = require('graceful-fs');

module.exports = class JSONDriver {
  /**
   * Create new JSON-Based database.
   * @param {string} path 
   * @constructor
   */
  constructor(path = 'database.json', spaces = 2) {
    s.string.parse(path);
    s.number.parse(spaces);

    path = `${process.cwd()}/${path}`;
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

    const seperators = path.split('/');
    let __path = '';
    for (let index = 0; index < (seperators.length - 1); index++) {
      __path += `${seperators[index]}/`;

      if (graceful.existsSync(__path)) continue;

      graceful.mkdirSync(__path);
    };

    if (!graceful.existsSync(this.path)) this.write({});
    else this.save();
  };

  /**
   * Database cache.
   * @readonly
   */
  cache = {};

  /**
   * Write database file.
   * @returns {void}
   */
  write() {
    graceful.writeFileSync(this.path, JSON.stringify(this.cache, null, this.spaces), { encoding: 'utf8' });

    return void 0;
  };

  /**
   * Save file to cache.
   * @returns {void}
   */
  save() {
    this.cache = JSON.parse(graceful.readFileSync(this.path, { encoding: 'utf8' }));

    return void 0;
  };
};