import { uid, dateNumeric } from '../../../core/index.js';
import type { DataMinimal, DataRoot } from '../../data.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Session } from './session.types.js';

const sessionKey = 'session';

export const sessionRoot = (): DataRoot<Session> => ({
  $subject: uid('user'),
  $credential: uid('credential'),
  exp: dateNumeric(),
  prv: false,
  adm: false,
  exc: false,
});

export const sessionCreate = (
  session: DataMinimal<Session, '$subject' | 'exp'>,
): Session => ({
  ...sessionRoot(),
  ...session,
  $id: uid(sessionKey),
});

export const sessionSlice = entitySliceCreate({
  key: sessionKey,
  create: sessionCreate,
});
