import Driver from 'drivers/Driver';

/**
 * Database Options.
 */
export interface DatabaseOptions {
  /**
   * Database Size.
   * @default 0
   */
  size?: number;

  /**
   * Database Overwrite. (Only 'push' method.)
   * @default true
   */
  overWrite?: boolean;

  /**
   * Database Autowrite.
   * @default true
   */
  autoWrite?: boolean;

  /**
   * Database Driver.
   * @default JSONDriver
   */
  driver?: Driver;
};

export interface DatabaseOptionsBase extends DatabaseOptions {
  size: number;
  overWrite: boolean;
  autoWrite: boolean;
  driver: Driver;
};

/**
 * Default Database Options.
 */
export const DatabaseOptionsDefault: DatabaseOptions = {
  size: 0,
  autoWrite: true,
  overWrite: false
};

export default DatabaseOptions;