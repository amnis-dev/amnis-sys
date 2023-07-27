import { contextSetup } from './context.js';
import { roleSlice } from '../data/entity/role/index.js';
import { systemSlice } from '../data/entity/system/index.js';

test('should create initial node context', async () => {
  const context = await contextSetup();

  const systems = systemSlice.select.all(context.store.getState());
  const roles = roleSlice.select.all(context.store.getState());

  expect(systems).toHaveLength(1);
  expect(roles).toHaveLength(4);

  const [system] = systems;

  expect(system).toEqual(expect.objectContaining({
    name: 'Core System',
  }));
  expect(true).toBe(true);
});
