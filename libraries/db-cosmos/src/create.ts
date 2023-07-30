import type { DatabaseCreateMethod, Entity, EntityObjects } from '@amnis/state';
import { initializeCheck, initializeContainer } from './initialize.js';
import type { CosmosDatabaseMethodInitalizer } from './cosmos.types.js';
import { entityToItem } from './utility.js';

export const cosmosCreateInitializer: CosmosDatabaseMethodInitalizer<DatabaseCreateMethod> = ({
  client,
  database,
  partitions,
}) => async (state) => {
  initializeCheck(client, database);

  const result: EntityObjects = {};

  /**
   * Insert the entities into the database.
   */
  const containerPromises = Object.entries(state).map<
  Promise<[string, Entity[]]>
  >(
    async ([sliceKey, entities]) => {
      const partitionKey = partitions[sliceKey];
      const resultInitContainer = await initializeContainer(database, sliceKey, partitionKey);
      if (!resultInitContainer) {
        return [sliceKey, []];
      }

      const createPromises = entities.map<Promise<Entity | undefined>>(async (entity) => {
        const item = entityToItem(entity);

        try {
          const { resource } = await database.container(sliceKey).items.create(item);
          if (resource) {
            return entity;
          }
          return undefined;
        } catch (error) {
          return undefined;
        }
      });

      const createResults = await Promise.all(createPromises);
      const created = createResults.filter((entity) => !!entity) as Entity[];

      return [sliceKey, created];
    },
  );

  /**
   * Update the result with the entities that were successfully created.
   */
  const containerResults = await Promise.all(containerPromises);
  containerResults.forEach(([sliceKey, entities]) => {
    result[sliceKey] = entities;
  });

  return result;
};

export default cosmosCreateInitializer;
