/* eslint-disable no-shadow */
import type { DateNumeric, UID } from '../../core/index.js';

/**
 * An interface for a bearer.
 */
export interface Bearer {
  /**
   * Bearer identifier.
   */
  $id: UID;

  /**
   * Expiration date.
   */
  exp: DateNumeric;

  /**
   * Encoded access token.
   */
  access: string;
}
