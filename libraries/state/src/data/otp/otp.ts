import type { Action, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import type { UID } from '../../core/index.js';
import { dateNumeric, uid } from '../../core/index.js';
import { dataSliceCreate } from '../data.slice.js';
import type { Otp, OtpMeta } from './otp.types.js';
import { OtpMethod } from './otp.types.js';
import type { DataState } from '../data.types.js';
import { dataActions } from '../data.actions.js';

const otpKey = 'otp';

export const otpBase = (): Omit<Otp, '$id'> => ({
  $sub: uid('subject'),
  len: 0,
  exp: dateNumeric('5m'),
  mth: OtpMethod.None,
});

const otpCreate = (
  otp: Omit<Otp, '$id' | 'len'> & { $id?: Otp['$id']},
): Otp => {
  const otpNew: Otp = {
    ...otpBase(),
    ...otp,
    $id: uid(otpKey),
    len: otp.val?.length ?? 0,
  };

  return otpNew;
};

const meta: OtpMeta = {
  latest: null,
};

/**
 * Matcher for any otp action.
 */
function isOtpAction(
  action: Action<string>,
): action is PayloadAction {
  return action.type.startsWith(otpKey);
}

/**
 * OTP Actions
 */
const otpActions = {
  /**
   * Sets the one-time password value on the latest OTP.
   */
  set: createAction(`${otpKey}/set`, (passcode: string) => ({
    payload: passcode,
  })),
};

export const otpSlice = dataSliceCreate({
  key: otpKey,
  create: otpCreate,
  meta,
  actions: otpActions,
  reducersExtras: [
    {
      cases: ({
        builder,
        adapter,
      }) => {
        builder.addCase(otpActions.set, (state, action) => {
          const { latest } = state;
          if (!latest) {
            return;
          }
          adapter.updateOne(state, {
            id: latest,
            changes: { val: action.payload },
          });
        });
      },
      matchers: ({
        key,
        builder,
        adapter,
      }) => {
        /**
         * Match any otp action.
         */
        builder.addMatcher(isOtpAction, (state) => {
          /**
           * Clean up any expired otps.
           */
          const now = dateNumeric();
          const expiredIds = Object.values(state.entities)
            .filter((e) => e !== undefined && e.exp <= now)
            .map((e) => e?.$id) as UID<Otp>[];

          adapter.removeMany(state, expiredIds);
        });

        /**
         * Matches data create action and references the latest otp.
         */
        builder.addMatcher(
          (action) => dataActions.create.match(action),
          (state, { payload }: Record<string, any>) => {
            if (
              typeof payload !== 'object'
            || payload[key] === undefined
            ) {
              return;
            }

            const otps = payload[key] as Otp[];
            const otpLatest = otps[otps.length - 1];
            if (!otpLatest) {
              return;
            }

            state.latest = otpLatest.$id;
          },
        );

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
              .map((e) => e?.$id) as UID<Otp>[];

            adapter.removeMany(state, expiredIds);
          },
        );
      },
    },
  ],
  selectors: {
    latest: (state) => {
      const slice = state[otpKey] as OtpMeta & DataState<Otp>;
      const { latest } = slice;
      if (!latest) {
        return undefined;
      }
      const otpLatest = slice.entities[latest];
      return otpLatest;
    },
    bySubject: (state, $subject: UID) => {
      const slice = state[otpKey] as OtpMeta & DataState<Otp>;
      const otpsFound = Object.values(slice.entities).filter((o) => (
        o?.$sub === $subject
      )) as Otp[];
      return otpsFound;
    },
  },
});
