export default class DatabaseError extends Error {
  /**
   * Create new Database error.
   * @param {string} message 
   * @param {{ name?: string }} options 
   */
  constructor(message, options = {}) {
    super(message);

    this.name = `HyprError[${options?.name ?? 'Unknown'}]`;
  };

  throw() {
    throw this;
  };
};