import type {
  Io,
  IoProcess,
  EntityObjects,

  Schema,
} from '@amnis/state';
import {
  schemaSlice,
  systemSlice,
} from '@amnis/state';
import { mwAccess } from '../../mw/index.js';
import type { ApiSysSchema } from '../../api.sys.types.js';
import { permissionGrants } from '../../utility/permission.js';

/**
 * Verifies the validity of an access bearer.
 */
export const process: IoProcess<
Io<ApiSysSchema, Schema[]>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { query: { type }, access } = input;

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

    if (!type) {
      output.status = 400; // 400 Bad Request
      output.json.logs.push({
        level: 'error',
        title: 'No Schema Type',
        description: 'A schema type is required.',
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
     * API definitions can always be accessed.
     * If it is not an API definition, then check the permissions.
     */
    if (!nameLowered.startsWith('api')) {
      const grants = permissionGrants(system, context, access.pem);
      const permitted = grants.some(
        ([grantKey, scope, task]) => (grantKey === nameLowered && scope > 0 && task > 0),
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

    const schema = schemaSlice.select.schema(store.getState(), name, id);

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
     * Obtain all references from this schema.
     */
    const references = schemaSlice.select.references(store.getState(), schema);

    /**
     * Set the output result to the schema definition and referenced schemas.
     */
    output.json.result = [schema, ...references];

    return output;
  }
);

export const processSysSchema = mwAccess()(
  process,
) as IoProcess<
Io<undefined, EntityObjects>
>;

export default processSysSchema;
