import { Entity, Role, dataMinimal } from "@amnis/state";
import { dataTest as stateData } from "@amnis/state/dataTest";
import { data as webData} from './data.js';

/**
 * Should merge data from nested state data.
 */
test('Should merge data from nested state data.', async () => {
  const stateDataCompiled = await stateData(dataMinimal());
  const webDataCompiled = await webData(stateDataCompiled);
  
  const roleAnonymous = webDataCompiled.role.find((role: Entity<Role>) => role.name === '%core:role_anon_name');
  expect(roleAnonymous?.grants).toHaveLength(3);
});
