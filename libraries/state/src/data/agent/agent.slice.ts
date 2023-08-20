/* eslint-disable no-bitwise */
import type { PayloadAction } from '@amnis/state/rtk';
import { createEntityAdapter, createSlice } from '@amnis/state/rtk';
import { uid, uidv2 } from '../../core/uid.js';
import { localStorage } from '../../localstorage.js';
import type { Credential } from '../entity/credential/index.js';
import { credentialSlice } from '../entity/credential/index.js';
import type {
  Agent,
  AgentCreator,
  AgentKey,
  AgentMeta,
  AgentSlice,
  AgentID,
  AgentType,
} from './agent.types.js';
import type { State } from '../../state.types.js';
import { dataActions } from '../data.actions.js';

export const agentKey: AgentKey = 'agent';
export const agentKeyLocalStorage = `${agentKey}s`;

/**
 * Load in stored agents from local storage.
 */
const agentsLocal = JSON.parse(localStorage().getItem(agentKeyLocalStorage) ?? '[]');

function agentSliceCreate(
  agent: AgentCreator,
): Agent {
  return {
    $credential: uid(credentialSlice.key),
    ...agent,
    $id: uidv2('agent'),
  };
}

const adapter = createEntityAdapter<Agent, AgentID>({
  selectId: (agent) => agent.$id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

let initialState = adapter.getInitialState<AgentMeta>({
  active: agentsLocal[0]?.$id ?? null,
});

initialState = adapter.addMany(initialState, agentsLocal);

/**
 * Adapter selectors.
 */
const adapterSelectors = adapter.getSelectors();

export const slice = createSlice({
  name: agentKey,
  initialState,
  reducers: {
    add: (state, action: PayloadAction<AgentCreator>) => {
      adapter.addOne(state, agentSliceCreate(action.payload));
    },
    addActiveSet: (state: AgentSlice, action: PayloadAction<AgentCreator>) => {
      const agent = agentSliceCreate(action.payload);
      adapter.addOne(state, agent);
      state.active = agent.$id;
    },
    addMany: (state, action: PayloadAction<AgentCreator[]>) => {
      adapter.addMany(state, action.payload.map((p) => agentSliceCreate(p)));
    },
    insert: (state, action: PayloadAction<Agent>) => {
      adapter.upsertOne(state, action.payload);
    },
    insertActiveSet: (state: AgentSlice, action: PayloadAction<Agent>) => {
      adapter.addOne(state, action.payload);
      state.active = action.payload.$id;
    },
    insertMany: (state, action: PayloadAction<Agent[]>) => {
      adapter.upsertMany(state, action.payload.map((p) => p));
    },
    update: (state, action: PayloadAction<Partial<Omit<Agent, '$id'>> & { $id: AgentID }>) => {
      const { $id, ...changes } = action.payload;
      adapter.updateOne(state, {
        id: $id,
        changes,
      });
    },
    updateActive: (state: AgentSlice, action: PayloadAction<Partial<Omit<Agent, '$id'>>>) => {
      const { payload: changes } = action;
      if (!state.active) { return; }
      adapter.updateOne(state, {
        id: state.active,
        changes,
      });
    },
    updateMany: (state, action: PayloadAction<(Partial<Omit<Agent, '$id'>> & { $id: AgentID })[]>) => {
      adapter.updateMany(state, action.payload.map((p) => {
        const { $id, ...changes } = p;
        return {
          id: $id,
          changes,
        };
      }));
    },
    remove: (state, action: PayloadAction<AgentID>) => {
      adapter.removeOne(state, action.payload);
    },
    removeMany: (state, action: PayloadAction<AgentID[]>) => {
      adapter.removeMany(state, action.payload);
    },
    activeSet(state, action: PayloadAction<AgentID | null>) {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith(`${agentKey}/`),
      (state: AgentSlice) => {
        /**
         * Only persist local agents
         */
        const agents = adapterSelectors.selectAll(state).filter((a) => a.type === 'local');

        /**
         * Sort the array of agents to ensure the active agent is first in the array.
         */
        agents.sort((a, b) => {
          if (a.$id === state.active) {
            return -1;
          }
          if (b.$id === state.active) {
            return 1;
          }
          return 0;
        });

        /**
         * Store the value into local storage.
         */
        localStorage().setItem(agentKeyLocalStorage, JSON.stringify(agents));
      },
    );

    builder.addMatcher(
      dataActions.wipe.match,
      (state, { payload }) => {
        if (payload?.spare?.includes(agentKey)) {
          return;
        }

        adapter.removeAll(state);
        adapter.addMany(state, agentsLocal);
      },
    );
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
 * App redux selectors.
 */
const select = {
  /**
   * Selects the active agent.
   */
  active: (state: State) => {
    const slice = state[agentKey] as AgentSlice;
    if (!slice.active) {
      return undefined;
    }
    return adapterSelectors.selectById(slice, slice.active);
  },

  /**
   * Generates an agent's credential.
   */
  credential: (state: State, $id: AgentID): Credential | undefined => {
    const slice = state[agentKey] as AgentSlice;
    const agent = adapterSelectors.selectById(slice as any, $id);
    if (!agent) {
      return undefined;
    }
    const credential = credentialSlice.create({
      name: agent.device,
      publicKey: agent.publicKey,
    });
    return {
      ...credential,
      $id: agent.$credential,
    };
  },

  all: (state: State) => {
    const slice = state[agentKey] as AgentSlice;
    return adapterSelectors.selectAll(slice);
  },

  type: (state: State, type: AgentType) => {
    const slice = state[agentKey] as AgentSlice;
    return adapterSelectors.selectAll(slice).filter((a) => a.type === type);
  },

  byId: (state: State, $id: AgentID) => {
    const slice = state[agentKey] as AgentSlice;
    return adapterSelectors.selectById(slice, $id);
  },

  entities: (state: State) => {
    const slice = state[agentKey] as AgentSlice;
    return adapterSelectors.selectEntities(slice);
  },
};

export const agentSlice = {
  key: agentKey,
  name: agentKey,
  initialState,
  getInitialState: () => initialState,
  action,
  select,
  create: agentSliceCreate,
  reducer,
};
