import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Note, NoteRoot, NoteMinimal } from './note.types.js';

const noteKey = 'note';

export const noteRoot: NoteRoot = {
  $subject: uid(''),
  text: '',
};

export function noteCreate(
  note: NoteMinimal,
): Note {
  return {
    ...noteRoot,
    ...note,
    $id: uid(noteKey),
  };
}

export const noteSlice = entitySliceCreate({
  key: noteKey,
  create: noteCreate,
});
