const { s } = require('@sapphire/shapeshift');
const graceful = require('graceful-fs');
const BSON = require('bson');

module.exports = class BSONDriver {
  /**
   * Create new Binary-Based database.
   * @param {string} path
   * @constructor 
   */
  constructor(path = 'database.bson') {
    s.string.parse(path);

    path = `${process.cwd()}/${path}`;
    if (!path.endsWith('.bson')) path += '.bson';

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
    const encrypted = BSON.serialize(this.cache);
    graceful.writeFileSync(this.path, encrypted, { encoding: 'binary' });

    return void 0;
  };

  /**
   * Save file to cache.
   * @returns {void}
   */
  save() {
    this.cache = BSON.deserialize(graceful.readFileSync(this.path));

    return void 0;
  };
};