import type { UID } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Human-freindly name to reference a particular subject.
 *
 * @pattern ^[A-Za-z0-9_-]+$
 * @minLength 1
 * @maxLength 24
 */
export type HandleName = string;

/**
 * Human-freindly name to reference a particular subject within an ID string.
 *
 * @pattern ^@[A-Za-z0-9_-]+$
 * @minLength 1
 * @maxLength 24
 */
export type HandleNameId = string;

/**
 * Handles contain unique names that reference a particular subject.
 * The subject is typically a user.
 */
export interface Handle extends Data {
  /**
   * The handle name.
   */
  name: HandleName;

  /**
   * The subject this handle references.
   */
  $subject: UID;
}

/**
 * Handle properties excluding the extended entity properties.
 */
export type HandleRoot = DataRoot<Handle>;

/**
 * Root properties.
 */
export type HandleMinimal = DataMinimal<Handle, 'name' | '$subject'>;

/**
 * Handle collection meta data.
 */
export type HandleMeta = DataMeta<Handle>;
