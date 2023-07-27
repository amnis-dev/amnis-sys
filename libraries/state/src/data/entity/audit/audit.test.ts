import { storeSetup } from '../../../store.js';
import {
  auditCreate, auditSlice, auditRoot,
} from './audit.js';

/**
 * ============================================================
 */
test('audit key should be is properly set', () => {
  expect(auditSlice.key).toEqual('audit');
});

/**
 * ============================================================
 */
test('should create a audit', () => {
  const audit = auditCreate({
    action: 'Testing',
    completed: true,
  });

  expect(audit).toEqual(
    expect.objectContaining({
      action: 'Testing',
      completed: true,
    }),
  );
});

/**
 * ============================================================
 */
test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[auditSlice.key],
  ).toEqual(auditSlice.initialState);
});

/**
 * ============================================================
 */
test('should handle creating a new entity', () => {
  const store = storeSetup();

  const base = auditRoot();
  const action = auditSlice.action.create(base);

  store.dispatch(action);
  const entities = auditSlice.select.all(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining(base));
});
