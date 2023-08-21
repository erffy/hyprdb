import { AnyDatabaseDriver } from './AnyDatabaseDriver';

/**
 * Database Options.
 */
export interface DatabaseOptions {
  /**
   * Database Name.
   * @default hypr
   */
  name?: string;

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