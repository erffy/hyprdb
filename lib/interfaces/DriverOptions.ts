/**
 * Driver Options.
 */
export interface DriverOptions {
  /**
   * Driver Path.
   * @default cwd
   */
  path?: string;

  /**
   * Driver (File) Name.
   * @default hypr
   */
  name?: string;

  /**
   * Spaces.
   * 
   * Note: Only available when 'useHexEncoding' is 'false'.
   * @default 2
   */
  spaces?: number;

  /**
   * Use old save method instead of new save method
   * 
   * Note: This can affect your performance.
   * @default false
   */
  useOldSaveMethod?: boolean;

  /**
   * Use hex encoding when save to file.
   * @default false
   */
  useHexEncoding?: boolean;
};

export const DriverDefaultOptions: DriverOptions = {
  path: process.cwd(),
  name: 'hypr',
  spaces: 2,
  useOldSaveMethod: false,
  useHexEncoding: false
};