import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Log, LogRoot, LogMinimal } from './log.types.js';

const logKey = 'log';

export const logRoot: LogRoot = {
  level: 'debug',
  title: 'Untitled Log',
  description: 'This log has no description.',
  system: 'System',
};

/**
 * Creates a log entry.
 */
export function logCreate(log: LogMinimal): Log {
  return {
    ...logRoot,
    ...log,
    $id: uid(logKey),
  };
}

export const logSlice = entitySliceCreate({
  key: logKey,
  create: logCreate,
  /**
   * Sort logs by created JSON date. Newest to oldest.
   */
  sort: (a, b) => {
    const aDate = new Date(a.created);
    const bDate = new Date(b.created);
    return bDate.getTime() - aDate.getTime();
  },
});
