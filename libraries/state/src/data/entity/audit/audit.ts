import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Audit, AuditRoot, AuditMinimal } from './audit.types.js';

const auditKey = 'audit';

export const auditRoot = (): AuditRoot => ({
  action: 'Unspecified',
  completed: false,
});

export function auditCreate(
  audit: AuditMinimal,
): Audit {
  return {
    ...auditRoot(),
    ...audit,
    $id: uid(auditKey),
  };
}

export const auditSlice = entitySliceCreate({
  key: auditKey,
  create: auditCreate,
});
