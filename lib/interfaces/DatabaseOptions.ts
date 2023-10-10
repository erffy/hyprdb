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
   * Database Driver.
   * @default JSONDriver
   */
  driver?: Driver;
};

export interface DatabaseOptionsBase extends DatabaseOptions {
  size: number;
  overWrite: boolean;
  driver: Driver;
};

export default DatabaseOptions;