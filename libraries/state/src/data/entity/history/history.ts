/* eslint-disable @typescript-eslint/no-explicit-any */
import { uid } from '../../../core/index.js';
import { GrantTask } from '../../grant/index.js';
import type { UID } from '../../../core/index.js';
import type {
  History, HistoryRoot, HistoryMinimal, HistoryStateMutator,
} from './history.types.js';
import { entitySliceCreate } from '../entity.slice.js';

const historyKey = 'history';

export const historyRoot = (): HistoryRoot => ({
  $subject: uid(historyKey, 'null'),
  task: GrantTask.None,
  mutation: null,
});

export function historyCreate(
  history: HistoryMinimal,
): History {
  return {
    ...historyRoot(),
    ...history,
    $id: uid(historyKey),
  };
}
/**
 * Create historic records of state mutations.
 */
export function historyMake(
  state: HistoryStateMutator,
  task: GrantTask,
): History[] {
  const histories: History[] = [];

  Object.values(state).forEach((mutators) => {
    mutators.forEach((mutation: any) => {
      const $subject: UID = typeof mutation === 'object' ? mutation?.$id : mutation;
      histories.push(historyCreate({
        $subject,
        task,
        mutation,
      }));
    });
  });

  return histories;
}

export const historySlice = entitySliceCreate({
  key: historyKey,
  create: historyCreate,
  sort: (a, b) => {
    const subjectA = a.$subject;
    const subjectB = b.$subject;
    if (subjectA < subjectB) {
      return -1;
    }
    if (subjectA > subjectB) {
      return 1;
    }
    return 0;
  },
});
