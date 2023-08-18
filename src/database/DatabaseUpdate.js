const kleur = require('kleur');
const boxen = require('boxen');

module.exports = class DatabaseUpdate {
  /**
   * Create new Updater.
   * @param {typeof import('./Database.mjs').default} database 
   * @constructor
   */
  constructor(database) {
    /**
     * Notify state.
     * @type boolean
     * @readonly
     */
    Object.defineProperty(this, 'notified', { value: false, writable: true, configurable: false });
  };

  /**
   * Pull module data from npm.
   * @returns {Promise<typeof this.module>}
   */
  async pull(callback = () => {}) {
    if (typeof callback != 'function') return;

    const __module = await (await fetch('https://registry.npmjs.org/hypr.db')).json();

    Object.defineProperty(this, 'module', { value: __module, writable: false, configurable: false, enumerable: false });

    callback(this.module);

    return this.module;
  };

  /**
   * Notify the latest update.
   * @returns {boolean}
   */
  notify() {
    if (this.notified) return (!this.notified);
    if (!this?.module?._id) throw new Error('Please pull npm module data using pull method.');

    const latest = this.module['dist-tags'].latest;

    if (DatabaseUpdate.version === latest) return true;

    const [latestMajor, latestMinor, latestPatch, latestBuild] = latest.split('.');
    const [currentMajor, currentMinor, currentPatch, currentBuild] = DatabaseUpdate.version.split('.');

    let type;
    let color;
    let message;

    if (currentMajor != latestMajor) {
      type = 'Major';
      color = 'red';
    } else if (currentMinor != latestMinor) {
      type = 'Minor';
      color = 'yellow';
    } else if (currentPatch != latestPatch) {
      type = 'Patch';
      color = 'blue';
    } else if (latestBuild && (currentBuild != latestBuild)) {
      type = 'Build';
      color = 'green';
    };

    message = `New ${kleur[color](type)} version available: ${kleur.red(DatabaseUpdate.version)} > ${kleur[color](latest)}`;

    this.notified = true;

    console.log(boxen(`hypr.db\n${message}\nChange Log: https://bit.ly/hyprdb-updates\n\n${((new Date(this.module.time[latest])).toUTCString()).replace('GMT', '')}`, {
      padding: 1,
      margin: 1,
      textAlignment: 'center',
      borderStyle: 'round',
      borderColor: 'white',
      backgroundColor: 'black'
    }));

    return this.notified;
  };

  /**
   * Database version.
   * @readonly
   * @static
   */
  static version = '5.1.9';
};