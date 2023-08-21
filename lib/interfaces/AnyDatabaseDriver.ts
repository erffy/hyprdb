import * as Drivers from '../drivers/index';
/**
 * All Database Drivers.
 */
export type AnyDatabaseDriver = Drivers.Base | Drivers.BSON | Drivers.INI | Drivers.JSON | Drivers.JSON5 | Drivers.TOML | Drivers.YAML;