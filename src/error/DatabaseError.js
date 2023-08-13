const kleur = require('kleur');

module.exports = class DatabaseError extends Error {
  /**
   * Create a new Database error.
   * @param {{ message: string, expected?: string, received?: string }} data
   * @constructor
   */
  constructor(data = {}) {
    super(data?.message);

    this.name = `HyprError[${this.constructor.name}]`;

    /**
     * @type Date
     * @readonly
     */
    this.timestamp = new Date();

    /**
     * @type typeof data
     * @private
     */
    this.data = data;

    Error.captureStackTrace(this, this.constructor);

    throw this.toString();
  };

  /**
   * Get error location.
   * @returns {{ path: string, line: string }}
   */
  fetchLocation() {
    const stackLines = this.stack.split('\n');

    if (stackLines.length > 0) {
      const matched = (stackLines[1].trim()).match(/at\s+(.*):(\d+):(\d+)/);
      if (matched) return { path: ((matched[1].split('file:///'))[1]), line: ((matched[2].split(':'))[0]) };
    };

    return { path: 'Unknown', line: 'Unknown' };
  };

  toString() {
    if (this.data?.expected) {
      const location = this.fetchLocation();
      const formattedTimestamp = this.timestamp.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });

      return `${kleur.blue('ValidationError')} > ${kleur.green(this.data.expected)}\n${kleur.red(`- Expected a ${this.data.expected} primitive.`)}\n\n${kleur.red('Received:')}\n | ${kleur.bold(this.data.received)}\n\nInformations\n- File: ${location.path}\n- Line: ${location.line}\n\n- Additional: ${JSON.stringify(this.data)}\n- Timestamp: ${formattedTimestamp} (${this.timestamp.toISOString()})`;
    } else return this.stack;
  };
};