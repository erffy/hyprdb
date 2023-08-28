import { DriverOptions, DriverDefaultOptions } from './DriverOptions';

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
   * Driver options.
   * @default DriverDefaultOptions
   */
  driver?: DriverOptions;
};

/**
 * Default Database Options.
 */
export const DatabaseDefaultOptions: DatabaseOptions = {
  size: 0,
  spaces: 2,
  autoWrite: true,
  overWrite: false,
  driver: DriverDefaultOptions
};