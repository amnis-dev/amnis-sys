/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * A data structure for audit information.
 */
export interface Audit extends Data {
  /**
   * Action attempted
   */
  action: string;

  /**
   * If the action was completed.
   */
  completed: boolean;

  /**
   * Input body data.
   */
  inputBody?: any;

  /**
   * Subject id of the audit.
   */
  $subject?: UID;

  /**
   * IP address of the subject.
   */
  ip?: string;

  /**
   * Location of the subject.
   */
  location?: string;
}

/**
 * Contact properties excluding the extended entity properties.
 */
export type AuditRoot = DataRoot<Audit>;

/**
 * Root properties in order to create a log.
 */
export type AuditMinimal = DataMinimal<Audit, 'action' | 'completed'>;

/**
 * Audit collection meta data.
 */
export type AuditMeta = DataMeta<Audit>;
