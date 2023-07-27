import type { UID } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * A message to aid memory about the historic change.
 */
export interface Note extends Data {
  /**
   * Subject this note is attached to.
   */
  readonly $subject: UID;

  /**
   * Textual content of the note.
   */
  text: string;
}

/**
 * Note properties excluding the extended entity properties.
 */
export type NoteRoot = DataRoot<Note>;

/**
 * Root properties in order to create a log.
 */
export type NoteMinimal = DataMinimal<Note, '$subject' | 'text'>;

/**
 * Note collection meta data.
 */
export type NoteMeta = DataMeta<Note>;
