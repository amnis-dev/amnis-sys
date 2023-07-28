import { systemImporter } from './systemImporter.js';

test('systemImporter', async () => {
  const system = await systemImporter([
    '@amnis/state',
    '@amnis/api',
  ]);

  expect(system).toHaveProperty('schemas');
  expect(system).toHaveProperty('processes');

  expect(system.schemas).toHaveLength(3);

  // Ensure system.process have exactly three properties.
  expect(Object.keys(system.processes)).toHaveLength(3);

  expect(system.processes).toHaveProperty('sys');
  expect(system.processes).toHaveProperty('auth');
  expect(system.processes).toHaveProperty('crud');
});
