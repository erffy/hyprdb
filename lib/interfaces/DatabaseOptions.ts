import Drivers, { AnyDatabaseDriver } from './AnyDatabaseDriver';

/**
 * Database Options.
 */
export interface DatabaseOptions {
  /**
   * Spaces. (Only JSON and JSON5)
   * @default 2
   */
  spaces?: number;

  /**
   * Database Size.
   * @default 0
   */
  size: number;

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
  driver: AnyDatabaseDriver;
};

/**
 * Default Database Options.
 */
export const DatabaseDefaultOptions: DatabaseOptions = {
  driver: (new Drivers.JSON()),
  size: 0,
  spaces: 2,
  autoWrite: true,
  overWrite: false
};