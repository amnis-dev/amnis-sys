import { createEntityAdapter, createSelector, createSlice } from '@amnis/state/rtk';
import type { EntityState, PayloadAction } from '@amnis/state/rtk';
import type { Schema, SchemaFile, SchemaMeta } from './schema.types.js';
import type { State } from '../../state.types.js';
import { pascalize } from '../../string.util.js';

export const schemaKey = 'schema';

/**
 * Initialized state with meta information.
 */
const schemaAdapter = createEntityAdapter<Schema, string>({
  selectId: (schema) => schema.$id,
  sortComparer: (a, b) => a.$id.localeCompare(b.$id),
});

/**
 * Initial state.
 */
const initialState = schemaAdapter.getInitialState<SchemaMeta>({
  $active: 'state',
});

/**
 * RTK App Slice
 */
const slice = createSlice({
  name: schemaKey,
  initialState,
  reducers: {
    /**
     * Populates the reducer state from a schema file.
     */
    populate: (state, action: PayloadAction<SchemaFile>) => {
      const schemaId = action.payload.$id;
      const schemas = Object.keys(action.payload.definitions).map((key) => {
        const schema: Schema = { ...action.payload.definitions[key] };
        schema.$id = `${schemaId}#/definitions/${key.replace(/</g, '%3C').replace(/>/g, '%3E')}`;
        return schema;
      });
      schemaAdapter.upsertMany(state, schemas);
    },

    /**
     * Sets the active schema.
     */
    setActive: (state, action: PayloadAction<string>) => {
      state.$active = action.payload;
    },

    /**
     * Inserts a schema into the state.
     */
    insert: (state, action: PayloadAction<Schema>) => {
      schemaAdapter.addOne(state, action.payload);
    },

    /**
     * Inserts many schemas into the state.
     */
    insertMany: (state, action: PayloadAction<Schema[]>) => {
      schemaAdapter.addMany(state, action.payload);
    },

    /**
     * Deletes all schemas from the state.
     */
    deleteAll: (state) => {
      schemaAdapter.removeAll(state);
    },

  },
});

/**
 * App redux reducer.
 */
const { reducer } = slice;

/**
 * App redux actions.
 */
const { actions: action } = slice;

/**
 * Selects a schema without references.
 */
const selectSchema = (state: State, name: string, id?: string): Schema | undefined => {
  const slice = state[schemaKey] as SchemaMeta & EntityState<Schema, string>;
  const namePascal = pascalize(name);

  const $id = `${id ?? slice.$active}#/definitions/${namePascal}`;
  const schema = slice.entities[$id];

  return schema;
};

/**
 * Selects a schema by it's references ID
 */
const selectReference = (state: State, id: string): Schema | undefined => {
  const slice = state[schemaKey] as SchemaMeta & EntityState<Schema, string>;

  const $id = `${slice.$active}${id}`;
  const schema = slice.entities[$id];

  return schema;
};

/**
 * Selects referenced schemas from a schema.
 */
const selectReferences = (state: State, schema: Schema): Schema[] => {
  const references: Schema[] = [];

  if (schema.$ref) {
    const reference = selectReference(state, schema.$ref);
    if (reference) {
      const referenceReferences = selectReferences(state, reference);
      references.push(...[reference, ...referenceReferences]);
    }
  }

  if (schema.type === 'array' && schema.items?.$ref) {
    const reference = selectReference(state, schema.items.$ref);
    if (reference) {
      const referenceReferences = selectReferences(state, reference);
      references.push(...[reference, ...referenceReferences]);
    }
  }

  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      const property = schema.properties?.[key] as Schema;
      if (property?.$ref) {
        const reference = selectReference(state, property.$ref);
        if (reference) {
          const referenceReferences = selectReferences(state, reference);
          references.push(...[reference, ...referenceReferences]);
        }
      }
      if (property?.type === 'array' && !!property.items?.$ref) {
        const reference = selectReference(state, property.items.$ref);
        if (reference) {
          const referenceReferences = selectReferences(state, reference);
          references.push(...[reference, ...referenceReferences]);
        }
      }
    });
  }

  return references;
};

/**
 * Compiles a de-referenced schema by name.
 */
const selectCompiled = createSelector(
  [
    (state: State): State => state,
    (state: State, name: string) => {
      const nameSplit = name.split('/');
      if (nameSplit.length > 1) {
        const [schemaId, schemaName] = nameSplit;
        return selectSchema(state, schemaName, schemaId);
      }
      return selectSchema(state, name);
    },
  ],
  (state, schema): Schema | undefined => {
    if (!schema) {
      return undefined;
    }

    if (schema.$ref) {
      const reference = selectReference(state, schema.$ref);
      if (reference) {
        const referenceName = reference.$id.split('/').slice(-1)[0];
        const referenceCompiled = selectCompiled(state, referenceName);
        if (referenceCompiled) {
          return {
            ...referenceCompiled,
            ...schema,
          } as Schema;
        }
      }
    }

    if (schema.type === 'array' && !!schema.items?.$ref) {
      const reference = selectReference(state, schema.items.$ref);
      if (reference) {
        const referenceName = reference.$id.split('/').slice(-1)[0];
        const referenceCompiled = selectCompiled(state, referenceName);
        if (referenceCompiled) {
          return {
            ...schema,
            items: referenceCompiled,
          };
        }
      }
    }

    if (schema.type === 'object' && schema.properties) {
      const properties: Record<string, Schema> = {};
      Object.keys(schema.properties).forEach((key) => {
        const property = schema.properties?.[key] as Schema;
        if (!property) {
          return;
        }
        if (property?.$ref) {
          const reference = selectReference(
            state,
            property.$ref,
          );
          if (reference) {
            const referenceName = reference.$id.split('/').slice(-1)[0];
            const referenceCompiled = selectCompiled(state, referenceName);
            if (referenceCompiled) {
              properties[key] = {
                ...referenceCompiled,
                ...property,
              } as Schema;
            }
          }
        } else if (property.type === 'array' && !!property.items?.$ref) {
          const reference = selectReference(
            state,
            property.items.$ref,
          );
          properties[key] = property;
          if (reference) {
            const referenceName = reference.$id.split('/').slice(-1)[0];
            const referenceCompiled = selectCompiled(state, referenceName);
            if (referenceCompiled) {
              properties[key] = {
                ...property,
                items: referenceCompiled,
              };
            }
          }
        } else {
          properties[key] = property;
        }
      });
      return {
        ...schema,
        properties,
      };
    }

    return schema;
  },
);

/**
 * App redux selectors.
 */
const select = {

  /**
   * Selects a schema by name.
   */
  schema: selectSchema,

  /**
   * Selects a schema by it's references ID.
   */
  reference: selectReference,

  /**
   * Selects a schema's references.
   */
  references: selectReferences,

  /**
   * Compiles a de-referenced schema by name.
   */
  compiled: selectCompiled,

};

export const schemaSlice = {
  key: schemaKey as typeof schemaKey,
  name: schemaKey as typeof schemaKey,
  initialState,
  getInitialState: () => initialState,
  action,
  select,
  reducer,
};

/**
 * Export the slice as default.
 */
export default schemaSlice;
