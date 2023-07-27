/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
// import type { Role } from '../../entity/index.js';
import type { State, StateScope } from '../../state.types.js';
import type { Grant } from './grant.types.js';
import {
  GrantTask,
} from './grant.types.js';

/**
 * Creates a task integer from an array.
 */
export function grantTask(
  create: number,
  read: number,
  update: number,
  remove: number,
): number {
  let value = GrantTask.None;

  if (create) { value |= GrantTask.Create; }
  if (read) { value |= GrantTask.Read; }
  if (update) { value |= GrantTask.Update; }
  if (remove) { value |= GrantTask.Delete; }

  return value;
}

/**
 * Combine an array of grant tasks.
 */
export function grantCombine(grants: Grant[]): Grant[] {
  const grantMap: Record<string, GrantTask> = {};

  grants.forEach((grant) => {
    const [key, scope, task] = grant;
    if (!scope) { return; }
    const keyMap = `${key}:${scope}`;
    if (!grantMap[keyMap]) {
      grantMap[keyMap] = task;
      return;
    }

    grantMap[keyMap] = grantMap[keyMap] | task;
  });

  const result = Object.keys(grantMap).map<Grant>((k) => {
    const [key, scope] = k.split(':');
    const scopeValue = parseInt(scope, 10);
    return [
      key,
      scopeValue,
      grantMap[k],
    ];
  });

  return result;
}

/**
 * Filter a state object by and grants and a task.
 */
export const grantStateFilter = (grants: Grant[], task: GrantTask, state: State): State => {
  const result: State = {};

  if (!task) {
    return result;
  }

  grants.forEach(([grantKey, , grantTasks]) => {
    if ((grantTasks & task) !== task) {
      return;
    }

    if (!state[grantKey]) {
      return;
    }

    result[grantKey] = state[grantKey];
  });

  return result;
};

/**
 * Creates a State Scope based on grants and a task.
 */
export const grantStateScope = (grants: Grant[], task: GrantTask): StateScope => {
  const authScope: StateScope = {};

  if (!task) {
    return authScope;
  }

  grants.forEach(([grantKey, grantScope, grantTasks]) => {
    if ((grantTasks & task) === task) {
      if (!authScope[grantKey]) {
        authScope[grantKey] = grantScope;
        return;
      }
      if (authScope[grantKey] && authScope[grantKey] > grantScope) {
        authScope[grantKey] = grantScope;
      }
    }
  });
  return authScope;
};
