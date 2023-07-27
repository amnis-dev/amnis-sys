import type { DateJSON } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Service entity
 */
export interface Service extends Data {
  /**
   * Name of the service.
   */
  name: unknown;

  /**
   * Description of the service.
   */
  description?: string;

  /**
   * Status of the service.
   */
  status: 'offline' | 'running' | 'restarting';

  /**
   * Last checked datetime
   */
  dateChecked: DateJSON;
}

/**
 * Service properties excluding the extended entity properties.
 */
export type ServiceRoot = DataRoot<Service>;

/**
 * Root properties in order to create a log.
 */
export type ServiceMinimal = DataMinimal<Service, 'name'>;

/**
 * Service collection meta data.
 */
export type ServiceMeta = DataMeta<Service>;
