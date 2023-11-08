import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import { roleSlice } from '../role/index.js';
import type { System, SystemRoot, SystemMinimal } from './system.types.js';

export const systemKey = 'system';

export const systemRoot = (): SystemRoot => ({
  name: '',
  handle: 'core',
  domain: '',
  cors: [],
  sessionKey: 'coreSession',
  sessionExpires: 10080,
  bearerExpires: 30,
  registrationOpen: true,
  challengeExpiration: 5,
  otpExpiration: 5,
  otpLength: 12,
  emailNews: 'news@system.test',
  emailNotify: 'notify@system.test',
  emailAuth: 'auth@system.test',
  fileSizeMax: 4096,
  languages: ['en', 'de'],
  $adminRole: uid(roleSlice.key),
  $execRole: uid(roleSlice.key),
  $anonymousRole: uid(roleSlice.key),
  $initialRoles: [],
});

export function systemCreate(
  system: SystemMinimal,
): System {
  const base = systemRoot();
  const handle = system.handle ?? base.handle;
  const sessionKey = system.sessionKey ?? `${handle}Session`;

  return {
    ...base,
    ...system,
    $id: uid(systemKey),
    handle,
    sessionKey,
  };
}

export const systemSlice = entitySliceCreate({
  key: systemKey,
  create: systemCreate,
});
