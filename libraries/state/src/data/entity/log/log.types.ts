import type { UID } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';
import type { User } from '../user/user.types.js';

/**
 * Log levels.
 */
export type LogLevel = 'fatal' | 'error' | 'success' | 'warn' | 'info' | 'debug';

/**
 * An entity object that contains log information.
 */
export interface Log extends Data {
  /**
   * Level of the log.
   */
  level: LogLevel;

  /**
   * Title of the log.
   */
  title: string;

  /**
   * Description of the log.
   */
  description: string;

  /**
   * System this log is from.
   */
  system: string;

  /**
   * UID to a user that invoked the log.
   */
  $invoker?: UID<User>;
}

/**
 * Root properties excluding the extended entities.
 */
export type LogRoot = DataRoot<Log>;

/**
 * Root properties in order to create a log.
 */
export type LogMinimal = DataMinimal<Log, 'title' | 'description' | 'level'>;

/**
 * Log collection meta data.
 */
export type LogMeta = DataMeta<Log>;
