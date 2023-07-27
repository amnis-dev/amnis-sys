import type { User } from '../../data/entity/user/user.types.js';
import type { Otp } from '../../data/otp/otp.types.js';

/**
 * Abstract emailer template interface.
 */
export type EmailerTemplate<T extends Record<string, unknown>> = (params: T) => string;

type ArgumentType<T> = T extends (arg1: infer U) => string ? U : never;

/**
 * Emailer templates.
 */
export interface EmailerTemplates {
  /**
   * One time password template.
   */
  otp: EmailerTemplate<{ user?: User, otp: Otp }>;
}

/**
 * Properties of an email.
 */
export interface EmailerSendProps<
  T extends EmailerTemplates = EmailerTemplates,
> {
  /**
   * The recipient of the email.
   */
  to: string;

  /**
   * The verified sender of this email.
   */
  from: string;

  /**
   * Name of the sender.
   */
  fromName?: string;

  /**
   * Emailer subject.
   */
  subject: string;

  /**
   * The template to use for the email.
   */
  template: keyof T;

  /**
   * Parameters to pass into the template.
   */
  params: ArgumentType<T[keyof T]>;
}

/**
 * Emailerer method.
 */
export type EmailerSend<
  T extends EmailerTemplates = EmailerTemplates,
> = (email: EmailerSendProps<T>) => Promise<boolean>;

/**
 * I/O interface for sending emails, texts, or other types of communication methods.
 */
export interface Emailer<
  T extends EmailerTemplates = EmailerTemplates,
> {
  send: EmailerSend<T>;
}

export type EmailerCreate<
  T extends EmailerTemplates = EmailerTemplates,
> = (templates?: T) => Emailer<T>;
