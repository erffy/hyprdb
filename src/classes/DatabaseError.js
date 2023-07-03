const Colorizer = require('string-colorizer').default;
const colorful = new Colorizer();

module.exports = class DatabaseError extends Error {
  /**
   * Create new Database error.
   * @param {string} message 
   * @param {{ name?: string }} options 
   */
  constructor(message, options = {}) {
    super(colorful.styles.bright(colorful.foregroundColors.yellow(message)));

    this.name = colorful.styles.bright(colorful.foregroundColors.red(`HyprError[${options?.name ?? 'Unknown'}]`));
  };

  throw() {
    throw this;
  };
};