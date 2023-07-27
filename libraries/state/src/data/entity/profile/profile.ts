import { uid } from '../../../core/index.js';
import type { Profile, ProfileRoot, ProfileMinimal } from './profile.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import { userSlice } from '../user/index.js';

const profileKey = 'profile';

export const profileRoot: ProfileRoot = {
  nameDisplay: 'Unnamed',
  $user: uid(userSlice.key),
};

export function profileCreate(
  profile: ProfileMinimal,
): Profile {
  return {
    ...profileRoot,
    ...profile,
    $id: uid(profileKey),
  };
}

export const profileSlice = entitySliceCreate({
  key: profileKey,
  create: profileCreate,
});
