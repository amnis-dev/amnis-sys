import { storeSetup } from '../../../store.js';
import {
  noteCreate,
  noteRoot,
  noteSlice,
} from './note.js';

/**
 * ============================================================
 */
test('note key should be is properly set', () => {
  expect(noteSlice.key).toEqual('note');
});

/**
 * ============================================================
 */
test('should create a note', () => {
  const note = noteCreate(noteRoot);

  expect(note).toEqual(
    expect.objectContaining(noteRoot),
  );
});

/**
 * ============================================================
 */
test('note should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[noteSlice.key],
  ).toEqual(noteSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new note', () => {
  const store = storeSetup();

  const action = noteSlice.action.create(noteRoot);

  store.dispatch(action);
  const entities = noteSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(noteRoot));
});
