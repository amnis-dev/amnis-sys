/* eslint-disable no-bitwise */
import type {
  IoInput,
  IoMiddleware,
  State,
  EntityObjects,
  DataUpdater,
  Entity,
  User,
  UID,
} from '@amnis/state';
import {
  roleSlice,
  historySlice,
  userSlice,
  dataActions,
  GrantTask,
  grantStateFilter,
  entityStrip,
  grantStateScope,
  historyMake,
  stateEntitiesCreate,
  systemSlice,
} from '@amnis/state';
import { findUserById } from '../utility/find.js';
import { generateUserAnonymous } from '../utility/generate.js';
import { permissionGrants } from '../utility/permission.js';

/**
 * Mapping of operation names.
 */
const mwStateTaskName: Record<GrantTask, string> = {
  [GrantTask.None]: 'None',
  [GrantTask.Create]: 'Create',
  [GrantTask.Read]: 'Read',
  [GrantTask.Update]: 'Update',
  [GrantTask.Delete]: 'Delete',
};

/**
 * Middleware that handle state filtering and sanitizing based on the
 * provided access object.
 */
export const mwState: IoMiddleware<GrantTask> = (
  (task) => (next) => (context) => async (input, output) => {
    const { access } = input;
    const { store } = context;

    /**
     * Ensure an access object is set.
     * mwAccess can provide an ananymous token.
     */
    if (!access) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'No access has not been provided.',
      });
      return output;
    }

    /**
     * Obtain the system entity.
     */
    const system = systemSlice.select.active(store.getState());

    if (!system) {
      output.status = 503; // Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to complete this process.',
      });
      return output;
    }

    const $subject = access.sub;
    const $permission = access.pem;

    /**
     * Get the grants from the role combination created during the user authentication.
     */
    const grants = permissionGrants(system, context, $permission);

    /**
     * If no grants are found, provide anonymous grants.
     */
    if (grants.length === 0) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Client is not authorized to complete the process.',
      });
      return output;
    }

    /**
     * Filter the state input.
     */
    const stateFiltered = grantStateFilter(grants, task, input.body);
    const stateKeys = Object.keys(stateFiltered);

    /**
     * Sanitize the filtered state.
     * Sanitation is only necessary for CREATE and UPDATE tasks.
     */
    if (task === GrantTask.Create || task === GrantTask.Update) {
      stateKeys.forEach((key) => {
        stateFiltered[key] = (stateFiltered as EntityObjects)[key]
          .map((entity) => entityStrip(entity));
      });
    }

    /**
     * USER SLICE PROTECTIONS
     */
    if (stateKeys.includes(userSlice.key)) {
      /**
       * Get information about the user executing this process.
       * If no user is found, an anonymous version is created.
       */
      const user = await findUserById(context, $subject) ?? generateUserAnonymous(system);

      const isAdmin = user.$roles.includes(system.$adminRole);
      const isExec = user.$roles.includes(system.$execRole);

      if (task & (GrantTask.Create | GrantTask.Update)) {
        /**
         * If the user does not belong to the subject...
         * And the user does not hold an administrative role...
         */
        const stateFilteredUsers = stateFiltered[userSlice.key] as Entity<User>[];
        if (
          (stateFilteredUsers.length !== 1 || stateFilteredUsers[0].$id !== $subject)
          && (!isAdmin && !isExec)
        ) {
          output.status = 401; // Unauthorized
          output.json.logs.push({
            level: 'error',
            title: 'Unauthorized',
            description: `Missing permissions to perform this ${mwStateTaskName[task].toLowerCase()} operation.`,
          });
          return output;
        }
      }

      if (task & GrantTask.Delete) {
        const stateFilteredUsers = stateFiltered[userSlice.key] as UID[];
        if (
          (stateFilteredUsers.length !== 1 || stateFilteredUsers[0] !== $subject)
          && (!isAdmin && !isExec)
        ) {
          output.status = 401; // Unauthorized
          output.json.logs.push({
            level: 'error',
            title: 'Unauthorized',
            description: `Missing permissions to perform this ${mwStateTaskName[task].toLowerCase()} operation.`,
          });
          return output;
        }
      }

      if (task & (GrantTask.Create | GrantTask.Update)) {
        /**
         * Hash any passwords on the user slice.
         * Also ensure the user being modified is not administrative.
         */
        // eslint-disable-next-line no-restricted-syntax
        for await (
          const entity of (stateFiltered as DataUpdater)[userSlice.key] as Partial<Entity<User>>[]
        ) {
          if (!entity || !entity.$id) {
            output.status = 500; // Internal Server Error
            output.json.logs.push({
              level: 'error',
              title: 'User Not Found',
              description: 'The user was not set.',
            });
            return output;
          }

          if (entity.password) {
            entity.password = await context.crypto.passHash(entity.password as string);
          }

          if (
            entity.$roles
            && (
              entity.$roles.includes(system.$adminRole)
              || entity.$roles.includes(system.$execRole)
            )
            && !isAdmin
          ) {
            output.status = 401; // Unauthorized
            output.json.logs.push({
              level: 'error',
              title: 'Unauthorized',
              description: 'Unable to apply the requested roles.',
            });
            return output;
          }

          if (task === GrantTask.Create) {
            const userEntity = entity as Entity<User>;
            if (
              !isAdmin
              && (
                userEntity.$roles.includes(system.$adminRole)
                || userEntity.$roles.includes(system.$execRole)
              )
            ) {
              output.status = 401; // Unauthorized
              output.json.logs.push({
                level: 'error',
                title: 'Unauthorized',
                description: 'Unable to perform operation with the roles set.',
              });
              return output;
            }
          }

          if (task === GrantTask.Update) {
            const userOnState = await findUserById(context, entity.$id);

            if (!userOnState) {
              output.status = 500; // Internal Server Error
              output.json.logs.push({
                level: 'error',
                title: 'User Not Found',
                description: 'Could not find user on the request.',
              });
              return output;
            }

            if (entity.handle) {
              output.status = 401; // Unauthorized
              output.json.logs.push({
                level: 'error',
                title: 'Handle Update Denied',
                description: 'Cannot update the handle of a user record.',
              });
              return output;
            }

            if (!isAdmin && userOnState.$roles.includes(system.$adminRole)) {
              output.status = 401; // Unauthorized
              output.json.logs.push({
                level: 'error',
                title: 'Unauthorized',
                description: 'Unable to perform this operation on administrative accounts.',
              });
              return output;
            }
          }
        }
      }
    }

    /**
     * ROLE SLICE PROTECTION
     */
    if (stateKeys.includes(roleSlice.key)) {
      /**
       * Get information about the user executing this process.
       * If no user is found, an anonymous version is created.
       */
      const user = await findUserById(context, $subject) ?? generateUserAnonymous(system);

      const isAdmin = user.$roles.includes(system.$adminRole);

      if (task & (GrantTask.Create | GrantTask.Update | GrantTask.Delete)) {
        /**
         * Only administrators can Create, Update, or Delete roles.
         */
        if (!isAdmin) {
          output.status = 401; // Unauthorized
          output.json.logs.push({
            level: 'error',
            title: 'Unauthorized',
            description: 'Missing permissions to perform the requested operation.',
          });
          return output;
        }
      }
    }

    /**
     * HISTORY SLICE PROTECTION
     */
    if (stateKeys.includes(historySlice.key)) {
      /**
       * History cannot be modified, read, created, or delete by normal means.
       */
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Operations cannot be performed on history.',
      });
      return output;
    }

    /**
     * Create the new input object to pass on.
     */
    const inputNew: IoInput<State> = {
      ...input,
      body: stateFiltered,
    };

    /**
     * Apply a scope to the input if it doesn't already exist.
     */
    if (!inputNew.scope) {
      inputNew.scope = grantStateScope(grants, task);
    }

    /**
     * Capture the ouput of the next function.
     */
    const outputNext = await next(context)(inputNew, output);

    /**
     * Create a list of keys that were stripped from the filter.
     */
    const deniedKeys: string[] = [];
    if (typeof outputNext.json.result === 'object') {
      const resultOutputNext = outputNext.json.result ?? {};
      Object.keys(input.body).forEach((inputKey) => {
        if (!resultOutputNext[inputKey]) {
          deniedKeys.push(inputKey);
        }
      });
    } else {
      deniedKeys.push(...Object.keys(input.body));
    }

    if (deniedKeys.length) {
      output.json.logs.push({
        level: 'error',
        title: `${mwStateTaskName[task]} Disallowed`,
        description: `Denied ${mwStateTaskName[task].toLowerCase()} operation in collection${deniedKeys.length > 1 ? 's' : ''}: ${deniedKeys.join(', ')}`,
      });
    }

    if (outputNext.status === 200) {
      /**
       * Capture state keys that made it into the output result.
       */
      if (typeof outputNext.json.result === 'object') {
        const successfulKeys = Object.keys(outputNext.json.result);
        if (successfulKeys.length) {
          outputNext.json.logs.push({
            level: 'success',
            title: `${mwStateTaskName[task]} Successful`,
            description: `Completed ${mwStateTaskName[task].toLowerCase()} operation in collection${successfulKeys.length > 1 ? 's' : ''}: ${successfulKeys.join(', ')}.`,
          });
        }
      }

      /**
       * Create historic records
       */
      if (
        task & (GrantTask.Update | GrantTask.Create | GrantTask.Delete)
        && outputNext.json.result
      ) {
        const stateCreateHistory = stateEntitiesCreate({
          [historySlice.key]: historyMake(
            outputNext.json.result as State,
            task,
          ),
        }, {
          $creator: access.sub,
          committed: true,
          new: false,
        });
        const resultHistory = await context.database.create(stateCreateHistory);
        if (resultHistory[historySlice.key]?.length) {
          outputNext.json.result[historySlice.key] = resultHistory[historySlice.key];
        }
      }
    }

    /**
     * Update server caching.
     */
    if (task === GrantTask.Create) {
      store.dispatch(dataActions.create(outputNext.json.result));
    }
    if (task === GrantTask.Update) {
      store.dispatch(dataActions.update(outputNext.json.result));
    }
    if (task === GrantTask.Delete) {
      store.dispatch(dataActions.delete(outputNext.json.result));
    }

    return outputNext;
  }
);

export default { mwState };
