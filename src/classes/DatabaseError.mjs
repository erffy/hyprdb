import chalk from 'chalk';

export default class DatabaseError extends Error {
  /**
   * Create new Database error.
   * @param {string} message 
   * @param {{ name?: string }} options 
   */
  constructor(message, options = {}) {
    super(chalk.yellowBright(message));

    this.name = chalk.redBright(`HyprError[${options?.name ?? 'Unknown'}]`);
  };

  throw() {
    throw this;
  };
};