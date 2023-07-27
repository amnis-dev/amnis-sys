import type { UID } from '../../core/index.js';
import { uidList } from '../../core/index.js';
import { GrantScope } from '../../data/grant/index.js';
import type {
  DataDeleter, Entity, EntityObjects, History,
} from '../../data/index.js';
import { dataOrder } from '../../data/data.js';
import type { Database } from './database.types.js';
import type { State } from '../../state.types.js';
import { localStorage } from '../../localstorage.js';

/**
 * Storage type.
 */
export type MemoryStorage = State<Record<UID, Entity | undefined>>;

const localMemoryDb = JSON.parse(localStorage().getItem('memory-db') ?? '{}');

/**
 * Storage object for entities.
 */
let storage: MemoryStorage = localMemoryDb;

/**
 * Function to get memory storage.
 */
export function databaseMemoryStorage() {
  return storage;
}

/**
 * Function to clear memory storage.
 */
export function databaseMemoryClear() {
  storage = {};
}

/**
 * This database is simply an interface for a JSON object.
 * Use this database interface for testing and mocking APIs.
 */
export const databaseMemory: Database = {
  initialize: async (initialStorage: MemoryStorage = {}) => {
    if (Object.keys(storage).length === 0) {
      storage = initialStorage;
      localStorage().setItem('memory-db', JSON.stringify(storage));
    }
  },
  /**
   * ================================================================================
   * CREATE
   * ----------------------------------------
   */
  create: async (state) => {
    const result: EntityObjects = {};

    Object.keys(state).forEach((sliceKey) => {
      const col: Entity[] = state[sliceKey];
      if (!Array.isArray(col)) {
        return;
      }
      col.forEach((entity) => {
        const entityId = entity.$id;
        if (!entity) {
          return;
        }

        const storageKey = sliceKey;

        if (!storage[storageKey]) {
          storage[storageKey] = {} as Record<UID, Entity>;
        }
        if (storage[storageKey][entityId]) {
          return;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        storage[storageKey][entityId] = entity;
        result[sliceKey].push(entity);
      });
    });

    localStorage().setItem('memory-db', JSON.stringify(storage));

    return result;
  },
  /**
   * ================================================================================
   * READ
   * ----------------------------------------
   */
  read: async (querySlice, controls = {}) => {
    const { scope, subject } = controls;
    const result: EntityObjects = {};

    Object.keys(querySlice).forEach((queryStateKey) => {
      const storageKey = queryStateKey;

      /**
       * Ensure this queryStateion is within auth scope.
       */
      if (scope && !scope[queryStateKey]) {
        return;
      }

      const query = querySlice[queryStateKey]?.$query || {};

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[storageKey]) {
        return;
      }

      /**
       * Ensure delete-marked entities are not queryStateed by default.
       */
      if (query.delete === undefined) {
        query.delete = { $eq: false };
      }

      result[queryStateKey] = Object.values(storage[storageKey]) as Entity[];

      /**
       * Define the start index and limit.
       */
      const start = querySlice[queryStateKey].$range?.start ?? 0;
      const limit = querySlice[queryStateKey].$range?.limit ?? 20;

      /**
       * Loop through the query properties.
       */
      Object.keys(query).forEach((queryKey) => {
        const entityKey = queryKey as keyof Entity;
        const filter = query[queryKey];

        result[queryStateKey] = dataOrder(
          result[queryStateKey],
          querySlice[queryStateKey].$order,
        ).slice(start, limit + start).filter((entity) => {
          /**
           * Check to ensure this entity is within the scope.
           * If the scope is owner only, the entity must have the owner id match the subject.
           */
          if (
            scope
            && scope[queryStateKey] === GrantScope.Owned
            && subject
            && (entity.$owner !== subject
              && !entity.$readers.includes(subject))
          ) {
            return false;
          }

          if (!filter) {
            return true;
          }

          const filterKeyLength = Object.keys(filter).length;
          let matches = 0;

          if (filter.$eq !== undefined && filter.$eq === entity[entityKey]) {
            matches += 1;
          }

          if (filter.$neq !== undefined && filter.$neq !== entity[entityKey]) {
            matches += 1;
          }

          if (
            filter.$lt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) < filter.$lt
          ) {
            matches += 1;
          }

          if (
            filter.$lte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) <= filter.$lte
          ) {
            matches += 1;
          }

          if (
            filter.$gt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) > filter.$gt
          ) {
            matches += 1;
          }

          if (
            filter.$gte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) >= filter.$gte
          ) {
            matches += 1;
          }

          if (filter.$in !== undefined && filter.$in.includes(entity[entityKey])) {
            matches += 1;
          }

          if (filter.$nin !== undefined && !filter.$nin.includes(entity[entityKey])) {
            matches += 1;
          }

          return matches === filterKeyLength;
        });

        if (querySlice[queryStateKey].$history) {
          const storageHistory = storage.history as Record<UID, Entity<History>>;
          if (storageHistory) {
            const entitiyIds = result[queryStateKey].map((e) => e.$id);
            const histories = Object.values(storageHistory).filter(
              (h) => entitiyIds.includes(h.$subject),
            );
            result.history = histories;
          }
        }
      });
    });

    return result;
  },
  /**
   * ================================================================================
   * UPDATE
   * ----------------------------------------
   */
  update: async (state, controls = {}) => {
    const { scope, subject } = controls;
    const result: EntityObjects = {};

    Object.keys(state).every((sliceKey) => {
      const storageKey = sliceKey;

      /**
       * Ensure this selection is within auth scope.
       */
      if (scope && !scope[sliceKey]) {
        return true;
      }

      const col = state[sliceKey];
      if (!Array.isArray(col)) {
        return true;
      }

      col.every((entity) => {
        const entityId = entity.$id;
        if (!entity) {
          return true;
        }
        if (!storage[storageKey]) {
          return true;
        }
        const storedEntity = storage[storageKey][entityId];
        if (!storedEntity) {
          return true;
        }
        /**
         * Check to ensure this entity is within the scope.
         * If the scope is owner only, the entity must have the owner id match the subject.
         */
        if (
          scope
          && scope[sliceKey] === GrantScope.Owned
          && storedEntity.$owner !== subject
        ) {
          return false;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        const storedEntityNext = {
          ...storedEntity,
          ...entity,
        };
        storage[storageKey][entityId] = storedEntityNext;
        result[sliceKey].push(storedEntityNext);
        return true;
      });

      localStorage().setItem('memory-db', JSON.stringify(storage));

      return true;
    });

    return result;
  },
  /**
   * ================================================================================
   * DELETE
   * ----------------------------------------
   */
  delete: async (state, controls = {}) => {
    const { scope, subject } = controls;
    const result: DataDeleter = {};

    Object.keys(state).every((sliceKey) => {
      const storageKey = sliceKey;

      /**
       * Ensure this selection is within auth scope.
       */
      if (scope && !scope[sliceKey]) {
        return true;
      }

      if (!storage[storageKey]) {
        return true;
      }
      const references = state[sliceKey];

      references.every((ref: UID) => {
        const storedEntity = storage[storageKey][ref];
        if (!storedEntity) {
          return true;
        }
        /**
         * Check to ensure this entity is within the scope.
         * If the scope is owner only, the entity must have the owner id match the subject.
         */
        if (
          scope
          && scope[sliceKey] === GrantScope.Owned
          && storedEntity.$owner !== subject
        ) {
          return false;
        }

        delete storage[storageKey][ref];
        if (!result[sliceKey]) {
          result[sliceKey] = uidList();
        }
        result[sliceKey].push(ref);

        return true;
      });

      return true;
    });

    localStorage().setItem('memory-db', JSON.stringify(storage));

    return result;
  },
};

export default databaseMemory;
