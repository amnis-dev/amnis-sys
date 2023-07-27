import { nanoid } from '@reduxjs/toolkit';
import type { DateJSON } from '../../core/index.js';
import { dateJSON } from '../../core/index.js';
import type {
  EmailerCreate,
  EmailerTemplates,
} from './emailer.types.js';
import { emailerTemplates } from './emailer.templates.js';

/**
 * Email interface
 */
interface EmailItem {
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
   * Body of the email.
   */
  body: string;

  /**
   * Date-time received.
   */
  received: DateJSON;
}

export type Emailerbox = Record<string, EmailItem[]>;

export type EmailerSendCallback = (inbox: Emailerbox) => void;

export type EmailerSendUnsubscribe = () => void;

let emailerboxes: Emailerbox = {};

const emailerSendSubcribers: { [key: string]: EmailerSendCallback } = {};

export const emailerboxStorage = () => emailerboxes;

export const emailerboxClear = () => { emailerboxes = {}; };

export const emailerSendSubscribe = (callback: EmailerSendCallback): EmailerSendUnsubscribe => {
  const uid = nanoid();
  emailerSendSubcribers[uid] = callback;
  return () => {
    delete emailerSendSubcribers[uid];
  };
};

export const emailerMemory: EmailerCreate = (templates: EmailerTemplates = emailerTemplates) => ({
  /**
   * Sends an emailer.
   */
  send: async (emailer) => {
    const emailerboxKey = emailer.to;

    if (!emailerboxes[emailerboxKey]) {
      emailerboxes[emailerboxKey] = [];
    }

    const { template, params, ...restEmail } = emailer;

    emailerboxes[emailerboxKey].push({
      ...restEmail,
      body: templates[template](params),
      received: dateJSON(),
    });

    Object.values(emailerSendSubcribers).forEach((listener) => listener(emailerboxes));

    return true;
  },
});

export default emailerMemory;
