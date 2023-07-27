import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Credential, CredentialRoot, CredentialMinimal } from './credential.types.js';

const credentialKey = 'credential';

export const credentialRoot = (): CredentialRoot => ({
  name: 'Unknown Credential',
  publicKey: '',
});

export const credentialCreate = (
  credential: CredentialMinimal,
): Credential => ({
  ...credentialRoot(),
  ...credential,
  $id: uid(credentialKey),
});

export const credentialSlice = entitySliceCreate({
  key: credentialKey,
  create: credentialCreate,
});
