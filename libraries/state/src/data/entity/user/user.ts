import type { LogMinimal } from '../log/index.js';
import { regexEmail, uid } from '../../../core/index.js';
import type { User, UserRoot, UserMinimal } from './user.types.js';
import { entitySliceCreate } from '../entity.slice.js';

const userKey = 'user';

export const userRoot = (): UserRoot => ({
  handle: 'unknown_user',
  locked: false,
  $credentials: [],
  $roles: [],
  $permits: [],
});

/**
 * User validation method.
 */
export function userCheck(user: User): LogMinimal[] {
  const logs: LogMinimal[] = [];

  if (user.email && !regexEmail.test(user.email)) {
    logs.push({
      title: 'Invalid User Email',
      description: 'User email address is not structured properly.',
      level: 'error',
    });
  }

  return logs;
}

/**
 * User creation.
 */
export function userCreate(
  user: UserMinimal,
): User {
  return {
    ...userRoot(),
    ...user,
    $id: uid(userKey),
  };
}

export const userSlice = entitySliceCreate({
  key: userKey,
  create: userCreate,
  /**
   * Sort users by handle. A-Z.
   */
  sort: (a, b) => a.handle.localeCompare(b.handle),
});
