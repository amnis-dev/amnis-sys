/**
 * Data scopes.
 */
// eslint-disable-next-line no-shadow
export enum GrantScope {
  None = 0,
  Global = 1,
  Group = 2,
  Owned = 4,
}

/**
 * Data tasks.
 */
// eslint-disable-next-line no-shadow
export enum GrantTask {
  None = 0,
  Create = 1,
  Read = 2,
  Update = 4,
  Delete = 8,
}

/**
 * A composition of granted tasks.
 *
 * @min 0
 * @max 15
 */
export type GrantTasks = number;

/**
  * Grant object.
  */
export type Grant = [
  key: string,
  scope: GrantScope,
  task: GrantTasks,
];

/**
  * Role grant string.
  */
export type GrantString = string;
