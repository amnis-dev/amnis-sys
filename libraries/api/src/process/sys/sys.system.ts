import type {
  Io,
  IoProcess,
  EntityObjects,
  System,
  Entity,
} from '@amnis/state';
import {
  apiSlice,
  systemKey,
  systemSlice,
} from '@amnis/state';

/**
 * Obtains system and api information.
 * This is fundemental information needed by the client to function.
 */
export const process: IoProcess<
Io<undefined, EntityObjects>
> = (context) => (
  async (input, output) => {
    const { store } = context;

    /**
     * Get the active system.
     */
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to obtain.',
      });
      return output;
    }

    /**
     * Return system apis.
     */
    const apis = apiSlice.select.systemApis(store.getState(), system.$id);

    const systemReturned: Entity<System> = {
      ...system,
      committed: true,
      new: false,
    };

    output.json.result = {
      [systemKey]: [systemReturned],
    };
    output.json.apis = apis;

    return output;
  }
);

export const processSysSystem = process as IoProcess<
Io<undefined, EntityObjects>
>;

export default processSysSystem;
