import { storeSetup } from '../../../store.js';
import {
  contactCreate, contactSlice, contactRoot,
} from './contact.js';

/**
 * ============================================================
 */
test('contact key should be is properly set', () => {
  expect(contactSlice.key).toEqual('contact');
});

/**
 * ============================================================
 */
test('should create a contact', () => {
  const contact = contactCreate({
    name: 'Amnis Contact',
  });

  expect(contact).toEqual(
    expect.objectContaining({
      name: 'Amnis Contact',
      socials: expect.any(Array),
    }),
  );
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[contactSlice.key],
  ).toEqual(contactSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new entity', () => {
  const store = storeSetup();

  const base = contactRoot();
  const action = contactSlice.action.create(base);

  store.dispatch(action);
  const entities = contactSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
