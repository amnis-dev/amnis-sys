import { createAction, nanoid } from '@reduxjs/toolkit';
import type { UID } from '../../../core/index.js';
import { uid } from '../../../core/index.js';
import type { Grant } from '../../grant/index.js';
import { grantCombine } from '../../grant/index.js';
import type {
  Role, RoleRoot, RoleCombo, RoleMinimal, RoleFsLimits, RoleMeta,
} from './role.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { State } from '../../../state.types.js';
import type { DataState } from '../../data.types.js';

const roleKey = 'role';

export const roleRoot = (): RoleRoot => ({
  name: 'Unconfigured Role',
  description: '',
  color: '',
  fsLimits: [0, 0, 0],
  grants: [],
});

function roleCreate(
  role: RoleMinimal,
): Role {
  return {
    ...roleRoot(),
    ...role,
    $id: uid(roleKey),
  };
}

/**
 * Combines an array of grants from a list of roles.
 */
export const roleGrantCombine = (roles: Role[]) => {
  /**
   * Concat all the grants from the roles.
   */
  const grantsRaw = roles.reduce<Grant[]>((acc, role) => {
    acc.push(...role.grants);
    return acc;
  }, []);

  /**
   * Combine the grants.
   */
  const grants = grantCombine(grantsRaw);

  return grants;
};

export function roleComboCreate(
  roles: Role[],
): RoleCombo {
  const id = nanoid();
  const $roles = roles.map((r) => r.$id);
  const grants = roleGrantCombine(roles);
  const combo: RoleCombo = [id, $roles, grants];
  return combo;
}

/**
 * Meta object for the role slice.
 */
const roleMeta: RoleMeta = {
  combo: {},
};

/**
 * Additional Role Actions
 */
const roleActions = {
  /**
   * Sets the one-time password value on the latest OTP.
   */
  insertCombo: createAction(`${roleKey}/insertCombo`, (combo: RoleCombo) => ({
    payload: combo,
  })),
};

export function roleFsLimitsCompress(
  fsLimitsArray: RoleFsLimits[],
): RoleFsLimits {
  const fsLimitsResult = fsLimitsArray.reduce<RoleFsLimits>(
    (acc, cur) => cur.map((limit, i) => {
      if (acc[i] < 0 || limit < 0) {
        return -1;
      }
      if (limit > acc[i]) {
        return limit;
      }
      return acc[i];
    }) as RoleFsLimits,
    [0, 0, 0],
  );

  return fsLimitsResult;
}

export const roleSlice = entitySliceCreate({
  key: roleKey,
  create: roleCreate,
  meta: roleMeta,
  actions: roleActions,
  reducersExtras: [{
    cases: ({
      builder,
    }) => {
      builder.addCase(roleActions.insertCombo, (state, action) => {
        const combo = action.payload;
        const [comboId] = combo;

        state.combo[comboId] = combo;
      });
    },
    matchers: () => { /** noop */ },
  }],
  selectors: {
    /**
     * Selects a combo id by role ids.
     */
    selectComboIdByRoles: (state: State, $roles: UID<Role>[]) => {
      const slice = state[roleKey] as RoleMeta & DataState<Role>;
      const comboId = Object.keys(slice.combo).find(
        (k) => (
          slice.combo[k].length === $roles.length
            && slice.combo[k][1].every((val, i) => val === $roles[i])
        ),
      );
      return comboId;
    },

    /**
   * Selects a combo id by role ids.
   */
    selectComboGrants: (state: State, $combo: string): Grant[] | undefined => {
      const slice = state[roleKey] as RoleMeta & DataState<Role>;
      const grants = slice.combo[$combo]?.[2];
      return grants;
    },
  },
});
