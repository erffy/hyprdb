export interface DatabaseManagerOptions {
  /**
   * Manager size.
   * @default 0
   */
  size?: number;

  /**
   * Disable Experimental Notification in Manager.
   * @default false
   */
  disableExperimentalNotification?: boolean;
};

export interface DatabaseManagerOptionsBase extends DatabaseManagerOptions {
  size: number;
  disableExperimentalNotification: boolean;
};

export default DatabaseManagerOptions;