import type {
  Io,
  IoProcess,
  EntityObjects,
} from '@amnis/state';
import {
  systemSlice,
} from '@amnis/state';
import { mwAccess, mwValidate } from '../../mw/index.js';
import type { ApiSysSchema } from '../../api.sys.types.js';
import { permissionGrants } from '../../utility/permission.js';

/**
 * Verifies the validity of an access bearer.
 */
export const process: IoProcess<
Io<ApiSysSchema, JSON>
> = (context) => (
  async (input, output) => {
    const { store, schemas } = context;
    const { body: { type }, access } = input;

    if (!access) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'No access has not been provided.',
      });
      return output;
    }

    /**
     * Get the active system.
     */
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available.',
      });
      return output;
    }

    /**
     * Split the pathing string to the schema object.
     * The slash should be enforced by the input schema.
     */
    const [id, name] = type.split('/');

    /**
     * Just in case something goes wrong, we'll check the split strings.
     */
    if (!id || !name) {
      output.status = 400; // 400 Bad Request
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Schema Type',
        description: 'The schema type is invalid.',
      });
      return output;
    }

    /**
     * Ensure the client has access permissions to the schema definition.
     */
    const nameLowered = name.toLowerCase();

    /**
     * API definitions should always be accessed.
     * If it is not an API definition, then check the permissions.
     */
    if (!nameLowered.startsWith('api')) {
      const grants = permissionGrants(system, context, access.pem);
      const permitted = grants.some(
        ([granttKey, scope, task]) => (granttKey === nameLowered && scope > 0 && task > 0),
      );
      if (!permitted) {
        output.status = 401; // 401 Unauthorized
        output.json.logs.push({
          level: 'error',
          title: 'Unauthorized',
          description: 'You do not have permission to access this schema definition.',
        });
        return output;
      }
    }

    /**
     * Get the schema object by id from the schema context.
     */
    const schema = schemas[id];

    if (!schema) {
      output.status = 400; // 400 Bad Request
      output.json.logs.push({
        level: 'error',
        title: 'Schema Not Found',
        description: `The schema id '${id}' could not be found.`,
      });
      return output;
    }

    /**
     * Search for the definition in the schema object.
     */
    const definition = schema.definitions[name] as JSON | undefined;

    if (!definition) {
      output.status = 400; // 400 Bad Request
      output.json.logs.push({
        level: 'error',
        title: 'Schema Definition Not Found',
        description: `The schema definition '${name}' could not be found.`,
      });
      return output;
    }

    /**
     * Set the output result to the schema definition.
     */
    output.json.result = definition;

    return output;
  }
);

export const processSysSchema = mwAccess()(
  mwValidate('sys/ApiSysSchema')(
    process,
  ),
) as IoProcess<
Io<undefined, EntityObjects>
>;

export default processSysSchema;
