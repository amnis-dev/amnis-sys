import type { Grant } from '../../grant/grant.types.js';
import type { UID } from '../../../core/core.types.js';
import type {
  Data,
  DataRoot,
  DataMinimal,
} from '../../data.types.js';

/**
 * Role limits
 */
export type RoleFsLimits = [other: number, image: number, video: number];

/**
 * A license is a defined object for granting multiple permissions to perform actions or selections.
 */
export interface Role extends Data {
  /**
  * Name of the license.
  */
  name: string;

  /**
   * A brief description of the license.
   */
  description: string;

  /**
   * Color that represents this role.
   */
  color: string;

  /**
   * file upload limits in kilobytes.
   */
  fsLimits: RoleFsLimits;

  /**
   * Permissions this license grants.
   */
  grants: Grant[];
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type RoleRoot = DataRoot<Role>;

/**
   * Root properties.
   */
export type RoleMinimal = DataMinimal<Role, 'name'>;

/**
 * A role combination.
 */
export type RoleCombo = [string, UID<Role>[], Grant[]];

/**
 * Role collection meta data.
 */
export interface RoleMeta {
  /**
   * UUID to a tuple of role UIDs and a list of grants.
   */
  combo: Record<string, RoleCombo>;
}
