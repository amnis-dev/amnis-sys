/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';
import type {
  Entity,
  Data,
  DataQuery,
  DataCreator,
  DataObjects,
  EntityObjects,
} from './data/index.js';
import {
  entityCreate,
} from './data/entity/entity.js';
import type {
  State,
} from './state.types.js';

function stateQueryReferenceMutate(
  query: DataQuery,
  identifier: string | string[],
) {
  let sliceKey = '';
  const ids = new Set();

  if (typeof identifier === 'string') {
    const [key] = identifier.split(':');
    sliceKey = key;
    ids.add(identifier);
  } else if (identifier.length > 0) {
    const [key] = identifier[0].split(':');
    sliceKey = key;
    identifier.forEach((ref) => ids.add(ref));
  } else {
    return;
  }

  if (!query[sliceKey]) {
    query[sliceKey] = {
      $query: {
        $id: {
          $in: [...ids],
        },
      },
    };
  } else {
    query[sliceKey]?.$query?.$id?.$in?.forEach((ref) => ids.add(ref));
    query[sliceKey] = {
      $query: {
        $id: {
          $in: [...ids],
        },
      },
    };
  }
}

/**
 * Creates a new state query based on the references in a state.
 * The new query will NOT include any references that already exist.
 */
export function stateReferenceQuery(creator: DataCreator): DataQuery {
  const stateQuery: DataQuery = {};

  const entityRefs: string[] = [];
  const references: string[] = [];

  /**
   * Loop through each of the slice keys.
   */
  Object.values(creator).forEach((slice) => {
    /**
     * Check each entity on the slices.
     */
    slice.forEach((entity) => {
      /**
       * Finally, check each property on the entity that is a references.
       * Remember, only references have the '$' prefix.
       */
      Object.keys(entity).forEach((propKey) => {
        // Add to the list of entity ids on this state array.
        // We don't need to query them again.
        entityRefs.push(entity.$id);
        if (propKey.charAt(0) !== '$') {
          return;
        }

        const ref = (entity as any)[propKey] as string;
        if (ref !== entity.$id) {
          references.push(ref);
        }
      });
    });
  });

  const referencesFinal = references.filter((ref) => !entityRefs.includes(ref));

  referencesFinal.forEach((ref) => {
    stateQueryReferenceMutate(stateQuery, ref);
  });

  return stateQuery;
}

/**
 * Converts a redux state tree to a state create object type.
 */
export function stateToCreate(state: State): DataCreator {
  const stateCreator: DataCreator = {};

  Object.keys(state).every((sliceKey) => {
    const slice = state[sliceKey] as EntityState<Data, string>;

    if (!slice.entities) {
      return true;
    }

    stateCreator[sliceKey] = Object.values(slice.entities) as Data[];

    return true;
  });

  return stateCreator;
}

/**
 * Creates a state of new complete entities from a creator state.
 */
export function stateEntitiesCreate(
  stateCreator: DataCreator,
  props: Partial<Entity<Data>> = {},
): EntityObjects {
  return Object.keys(stateCreator).reduce<EntityObjects>((acc, sliceKey) => {
    acc[sliceKey] = stateCreator[sliceKey].map(
      (entityCreator) => entityCreate(entityCreator, props),
    );
    return acc;
  }, {});
}

/**
 * Merges two state entities.
 */
export function stateMerge<
  S extends DataObjects = DataObjects
>(state1: S, state2: S): S {
  const result: DataObjects = { ...state1 };
  Object.keys(state2).forEach((sliceKey) => {
    if (Array.isArray(result[sliceKey])) {
      result[sliceKey].push(...state2[sliceKey]);
    } else {
      result[sliceKey] = [...state2[sliceKey]];
    }
  });
  return result as S;
}
