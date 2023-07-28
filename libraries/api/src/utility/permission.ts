import type { Grant, IoContext, System } from '@amnis/state';
import { roleSlice } from '@amnis/state';

/**
 * Returns an array of grants based on a permission id.
 */
export const permissionGrants = (
  system: System,
  context: IoContext,
  $permission?: string,
): Grant[] => {
  const { store } = context;
  const grants: Grant[] = [];

  if ($permission) {
    const comboGrants = roleSlice.select.selectComboGrants(store.getState(), $permission);

    if (comboGrants) {
      grants.push(...comboGrants);
      return grants;
    }
  }

  const roleAnon = roleSlice.select.byId(store.getState(), system.$anonymousRole);
  if (roleAnon) {
    grants.push(...roleAnon.grants);
    return grants;
  }

  return grants;
};

export default { permissionGrants };
