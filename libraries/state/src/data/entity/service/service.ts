import { dateJSON, uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Service, ServiceRoot, ServiceMinimal } from './service.types.js';

const serviceKey = 'service';

export const serviceRoot: ServiceRoot = {
  name: 'Unknown Service',
  status: 'offline',
  dateChecked: dateJSON(),
};

export function serviceCreate(
  service: ServiceMinimal,
): Service {
  return {
    ...serviceRoot,
    dateChecked: dateJSON(),
    ...service,
    $id: uid(serviceKey),
  };
}

export const serviceSlice = entitySliceCreate({
  key: serviceKey,
  create: serviceCreate,
});
