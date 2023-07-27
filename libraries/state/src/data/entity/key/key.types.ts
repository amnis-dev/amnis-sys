import type { UID } from '../../../core/index.js';
import type { Data } from '../../data.types.js';
import type { Credential } from '../credential/index.js';

/**
 * Key object  for storing cryptographic keys.
 */
export interface Key extends Data {
  /**
   * Human friendly name for the cyptographic key
   */
  name: string;

  /**
   * Type of encryption algorithm.
   */
  format: 'raw' | 'pkcs8' | 'spki' | 'jwk';

  /**
   * Determines if the key is wrapped.
   */
  wrapped: boolean;

  /**
   * The encoded value of the encryption key.
   */
  value: string;

  /**
   * The credential this key is connected with.
   */
  $credential?: UID<Credential>
}
