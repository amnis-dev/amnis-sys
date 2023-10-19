import React from 'react';
import type { Schema } from '@amnis/state';
import { noop } from '@amnis/state';
import type { EntryContextSchemaErrors, EntryContextTips } from './EntryContextSchemas.types.js';

export type EntryContextChanges<T = any> = {
  before: T;
  after: T;
};

export interface EntryContextProps<T = any> {
  entryId: string;
  entryBoxId: string;
  entryInputId: string;
  entryLabelId: string;
  entryErrorId: string;
  entryDescriptionId: string;
  entrySuggestionsId: string;
  pattern?: string;
  value: T | undefined;
  changes?: EntryContextChanges<T>,
  properties: (Schema & { key: string })[];
  propertiesRequired: string[];
  items: Schema;
  uniqueItems: boolean;
  optionsFilter: T[];
  label: string;
  labelInput: string;
  description: string | null;
  errors: EntryContextSchemaErrors[];
  errored: boolean;
  errorText: Record<EntryContextSchemaErrors, string>;
  tipText: Record<EntryContextTips, string>;
  required: boolean;
  disabled: boolean;
  optionalText: string;
  condensed: boolean;
  focused: boolean;
  focusedSetter: (value: boolean) => void;
  autoFocus: boolean;
  suggestions: string[];
  suggestionFilter: string;
  suggestionFilterSetter: (value: string) => void;
  suggestionSelect: string | null;
  suggestionSelectSetter: (value: string | null) => void;
  onChange: (value: T | undefined, event?: React.ChangeEvent<HTMLElement>) => void;
  onSelect: (value: T | undefined, event?: React.ChangeEvent<HTMLElement>) => void;
  onBlur: (event?: React.FocusEvent<HTMLElement>) => void;
  onFocus: (event?: React.FocusEvent<HTMLElement>) => void;
  onError: (errors: EntryContextSchemaErrors[]) => void;
  hasLabelElement: boolean;
  hasLabelElementSetter: (value: boolean) => void;
  hasDescriptionElement: boolean;
  hasDescriptionElementSetter: (value: boolean) => void;
  hasErrorElement: boolean;
  hasErrorElementSetter: (value: boolean) => void;
}

const entryContextTipTextEnglish: Record<EntryContextTips, string> = {
  changes: 'This input has unsaved changes.',
  errors: 'This input is invalid.',
};

const entryContextTipTextGerman: Record<EntryContextTips, string> = {
  changes: 'Dieser Eingang hat ungespeicherte Änderungen.',
  errors: 'Dieser Eingang ist ungültig.',
};

export const entryContextTipTextLocale = {
  en: entryContextTipTextEnglish,
  de: entryContextTipTextGerman,
};

const entryContextErrorTextEnglish: Record<EntryContextSchemaErrors, string> = {
  required: 'A value is required.',
  type: 'The value is not the correct type.',
  maxLength: 'The text is too long.',
  minLength: 'The text is too short.',
  pattern: 'The value does not match the a valid pattern.',
  minimum: 'The value is too small.',
  maximum: 'The value is too large.',
  exclusiveMinimum: 'The value is too small.',
  exclusiveMaximum: 'The value is too large.',
  multipleOf: 'The value is not a multiple of the given number.',
  format: 'The value is not in the correct format.',
  minItems: 'The value does not contain enough items.',
  maxItems: 'The value contains too many items.',
  uniqueItems: 'The value contains duplicate items.',
  url: 'The value is not a valid URL.',
  email: 'The value is not a valid email address.',
  hostname: 'The value is not a valid hostname.',
};

const entryContextErrorTextGerman: Record<EntryContextSchemaErrors, string> = {
  required: 'Ein Wert ist erforderlich.',
  type: 'Der Wert ist nicht der richtige Typ.',
  maxLength: 'Der Text ist zu lang.',
  minLength: 'Der Text ist zu kurz.',
  pattern: 'Der Wert entspricht nicht einem gültigen Muster.',
  minimum: 'Der Wert ist zu klein.',
  maximum: 'Der Wert ist zu groß.',
  exclusiveMinimum: 'Der Wert ist zu klein.',
  exclusiveMaximum: 'Der Wert ist zu groß.',
  multipleOf: 'Der Wert ist kein Vielfaches der angegebenen Zahl.',
  format: 'Der Wert ist nicht im richtigen Format.',
  minItems: 'Der Wert enthält nicht genügend Elemente.',
  maxItems: 'Der Wert enthält zu viele Elemente.',
  uniqueItems: 'Der Wert enthält doppelte Elemente.',
  url: 'Der Wert ist keine gültige URL.',
  email: 'Der Wert ist keine gültige E-Mail-Adresse.',
  hostname: 'Der Wert ist kein gültiger Hostname.',
};

export const errorTextLocale = {
  en: entryContextErrorTextEnglish,
  de: entryContextErrorTextGerman,
};

export const entryContextDefault: EntryContextProps = {
  entryId: 'entry',
  entryBoxId: 'entry-box',
  entryInputId: 'entry-input',
  entryLabelId: 'entry-label',
  entryErrorId: 'entry-error',
  entryDescriptionId: 'entry-desc',
  entrySuggestionsId: 'entry-sugg',
  value: undefined,
  changes: undefined,
  properties: [],
  propertiesRequired: [],
  items: {
    $id: 'item',
    type: 'string',
  },
  uniqueItems: false,
  optionsFilter: [],
  label: 'unlabelled',
  labelInput: 'unlabelled',
  description: null,
  errors: [],
  errorText: errorTextLocale.en,
  errored: false,
  tipText: entryContextTipTextLocale.en,
  optionalText: '(Optional)',
  condensed: false,
  suggestions: [],
  suggestionFilter: '',
  suggestionFilterSetter: noop,
  suggestionSelect: null,
  suggestionSelectSetter: noop,
  required: false,
  disabled: false,
  focused: false,
  focusedSetter: noop,
  autoFocus: false,
  hasLabelElement: false,
  hasLabelElementSetter: noop,
  hasDescriptionElement: false,
  hasDescriptionElementSetter: noop,
  hasErrorElement: false,
  hasErrorElementSetter: noop,
  onChange: noop,
  onSelect: noop,
  onBlur: noop,
  onFocus: noop,
  onError: noop,
};

export const EntryContext = React.createContext<EntryContextProps>(entryContextDefault);

export default EntryContext;
