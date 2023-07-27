import { nanoid } from '@reduxjs/toolkit';
import type { UID } from '../../core/index.js';
import { dateNumeric, uid } from '../../core/index.js';
import type { Challenge } from './challenge.types.js';
import { dataSliceCreate } from '../data.slice.js';

export const challengeKey = 'challenge';

export const challengeBase = (): Omit<Challenge, '$id'> => ({
  val: nanoid(8),
  exp: dateNumeric('5m'),
});

export const challengeCreate = (
  challenge: Partial<Challenge>,
): Challenge => {
  const challangeNew: Challenge = {
    ...challengeBase(),
    ...challenge,
    $id: uid(challengeKey),
  };

  return challangeNew;
};

export const challengeSlice = dataSliceCreate({
  key: challengeKey,
  create: challengeCreate,
  reducersExtras: [
    {
      cases: () => { /** noop */ },
      matchers: ({
        key,
        adapter,
        builder,
      }) => {
        /**
         * Matches and data action with this key in context.
         */
        builder.addMatcher(
          (action) => action.type.startsWith('@data'),
          (state, { payload }: Record<string, any>) => {
            if (
              typeof payload !== 'object'
              || payload[key] === undefined
            ) {
              return;
            }

            /**
             * Clean up any expired otps.
             */
            const now = dateNumeric();
            const expiredIds = Object.values(state.entities)
              .filter((e) => e !== undefined && e.exp <= now)
              .map((e) => e?.$id) as UID<Challenge>[];

            adapter.removeMany(state, expiredIds);
          },
        );
      },
    },
  ],
});
