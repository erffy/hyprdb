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
   * Driver Type.
   * @default 'constructor name'
   */
  type?: string;

  /**
   * Spaces. (Only available on 'JSON' and 'JSON5')
   * @default 2
   */
  spaces?: number;

  /**
   * Enable Experimental Features.
   * @default false
   */
  experimentalFeatures?: boolean;
};

export const DriverDefaultOptions: DriverOptions = {
  path: process.cwd(),
  name: 'hypr',
  spaces: 2,
  experimentalFeatures: false
};