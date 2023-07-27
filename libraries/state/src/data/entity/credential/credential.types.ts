import type {
  DateJSON, Encoding, IP, Name,
} from '../../../core/index.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Entity that contains data to verify credentials.
 */
export interface Credential extends Data {
  /**
   * Name of the credential
   */
  name: Name;

  /**
   * Credential's public key for verifying signatures.
   */
  publicKey: Encoding;

  /**
   * The IP address when the credential was registered.
   */
  ip?: IP;

  /**
   * Date-time of when the credential was last used.
   */
  used?: DateJSON
}

/**
 * Root object without a generated identifier.
 */
export type CredentialRoot = DataRoot<Credential>;

/**
 * Minimal parameters for creation.
 */
export type CredentialMinimal = DataMinimal<Credential, 'ip' | 'name' | 'publicKey'>;

/**
 * Credential collection meta data.
 */
export type CredentialMeta = DataMeta<Credential>;
