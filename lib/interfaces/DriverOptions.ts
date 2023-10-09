import DriverTypes from 'interfaces/DriverTypes';

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
   * Driver Name.
   * @default hypr
   */
  name?: string;

  /**
   * Driver Type.
   * @default 'auto'
   */
  type?: DriverTypes;

  /**
   * Spaces.
   * 
   * Note: Only available in 'JSON'.
   * @default 2
   */
  spaces?: number;
};

export const DriverOptionsDefault: DriverOptions = {
  path: process.cwd(),
  name: 'hypr',
  type: 'json',
  spaces: 2
};

export default DriverOptions;