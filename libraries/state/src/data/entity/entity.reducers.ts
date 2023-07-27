/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Action,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { UID } from '../../core/index.js';
import { dataActions } from '../data.actions.js';
import type {
  Data,
  DataCreator,
  DataDeleter,
  DataReducerSettings,
  DataUpdater,
} from '../data.types.js';
import type {
  Entity,
} from './entity.types.js';

export interface MetaOptions {
  active?: boolean;
  focused?: boolean;
  selection?: boolean;
}

export interface CreatePayload<C extends Data> {
  entity: Entity<C>;
  meta?: MetaOptions;
}

/**
 * Matcher for data create actions.
 */
function isDataCreatorAction(
  action: Action<string>,
): action is PayloadAction<DataCreator<Entity>> {
  return action.type === dataActions.create.type;
}

/**
 * Matcher for data update actions.
 */
function isDataUpdateAction(
  action: Action<string>,
): action is PayloadAction<DataUpdater<Entity>> {
  return action.type === dataActions.update.type;
}

/**
 * Matcher for data delete actions.
 */
function isDataDeleteAction(
  action: Action<string>,
): action is PayloadAction<DataDeleter> {
  return action.type === dataActions.delete.type;
}

export const entityExtraReducers = {

  cases: () => { /** noop */ },

  matchers: <D extends Entity>({
    key,
    builder,
    adapter,
  }: DataReducerSettings<D>) => {
    /**
     * Data creates
     */
    builder.addMatcher(
      isDataCreatorAction,
      (state, { payload }) => {
        if (!payload[key]) {
          return;
        }

        const updates: { id: string, changes: Partial<Entity> }[] = [];
        payload[key].forEach((entity) => {
          if (state.original[entity.$id]) {
            updates.push({ id: entity.$id, changes: { committed: false } });
          }

          if (entity.new) {
            state.new[entity.$id] = true;
          } else if (state.new[entity.$id]) {
            delete state.new[entity.$id];
          }
        });

        if (updates.length > 0) {
          /** @ts-ignore */
          adapter.updateMany(state, updates);
        }
      },
    );
    /**
     * Data updates
     */
    builder.addMatcher(isDataUpdateAction, (state, { payload }) => {
      if (!payload[key]) {
        return;
      }

      payload[key].forEach((update) => {
        const { $id } = update;
        const entity = state.entities[$id] as Entity | undefined;

        if (!entity) {
          return;
        }

        const diffResult = state.differences[$id] ?? [];

        if (diffResult.length === 0 && !entity.committed) {
          entity.committed = true;
        }

        if (diffResult.length > 0 && entity.committed) {
          entity.committed = false;
        }
      });
    });

    /**
     * Data deletes
     */
    builder.addMatcher(isDataDeleteAction, (state, { payload }) => {
      if (!payload[key]) {
        return;
      }

      if (state.active && payload[key].includes(state.active)) {
        state.active = null;
      }

      if (state.focused && payload[key].includes(state.focused)) {
        state.focused = null;
      }

      if (
        state.selection.length > 0
      && payload[key].some((id) => state.selection.includes(id as UID))
      ) {
        state.selection = state.selection.filter((selectionId: UID) => (
          payload[key].includes(selectionId)
        ));
      }
    });
  },
};
