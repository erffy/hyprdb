export interface PingResult {
  /**
   * Driver name.
   */
  from: string;

  /**
   * set function speed.
   */
  set: string;

  /**
   * get function speed.
   */
  get: string;

  /**
   * del function speed.
   */
  del: string;

  /**
   * average speed.
   */
  average: string;
};