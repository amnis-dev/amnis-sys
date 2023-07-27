import type { UID } from '../../../core/core.types.js';
import type { Data } from '../../data.types.js';
import type { GrantString } from '../../grant/grant.types.js';

/**
 * A permit is a list of grants for a specific identifier ID.
 */
export interface Permit extends Data {
  /**
   * UID to the entity that issued this permit.
   */
  $issuer: UID;

  /**
   * Owner of the permit that can perform the granted actions.
   */
  $holder: UID;

  /**
   * UID to the entity that the owner has been granted actions on.
   */
  $target: UID;

  /**
   * Grants this permit provides.
   */
  grants: GrantString[];
}
