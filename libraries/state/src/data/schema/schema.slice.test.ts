import {
  schemaSlice,
} from './schema.slice.js';
import schema from '../../schema/state.schema.json';

import { storeSetup } from '../../store.js';

test('should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()[schemaSlice.key],
  ).toEqual(schemaSlice.initialState);
});

test('should populate the state with schema data', () => {
  const store = storeSetup();

  store.dispatch(schemaSlice.action.populate(schema));

  const userSchema = schemaSlice.select.schema(store.getState(), 'User');

  if (!userSchema) {
    expect(userSchema).not.toBeUndefined();
    return;
  }

  expect(userSchema.$id).toEqual('state#/definitions/User');
  expect(userSchema.type).toEqual('object');

  const userReferences = schemaSlice.select.references(store.getState(), userSchema);
  expect(userReferences.length).toBeGreaterThan(5);
});

test('should compile a schema', () => {
  const store = storeSetup();

  store.dispatch(schemaSlice.action.populate(schema));

  const userCompiled = schemaSlice.select.compiled(store.getState(), 'User');

  if (!userCompiled) {
    expect(userCompiled).not.toBeUndefined();
    return;
  }

  expect(userCompiled.$id).toEqual('state#/definitions/User');

  if (userCompiled.type !== 'object') {
    expect(userCompiled.type).toEqual('object');
    return;
  }

  if (!userCompiled.properties) {
    expect(userCompiled.properties).not.toBeUndefined();
    expect(userCompiled.properties).not.toBeNull();
    return;
  }

  expect(Object.keys(userCompiled.properties).length).toBeGreaterThan(5);

  if (userCompiled.properties.$id.type !== 'string') {
    expect(userCompiled.properties.$id.type).toEqual('string');
    return;
  }
  expect(userCompiled.properties.$id.$id).toEqual('state#/definitions/UID');
  expect(userCompiled.properties.$id.description).toEqual(expect.any(String));
  expect(userCompiled.properties.$id.pattern).toEqual(expect.any(String));
});
