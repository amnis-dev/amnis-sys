import React from 'react';
import type { Schema } from '@amnis/state';
import { noop } from '@amnis/state';
import type { EntryContextSchemaErrors } from './EntryContextSchemas.types.js';

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
  hasLabelElement: boolean;
  hasLabelElementSetter: (value: boolean) => void;
  hasDescriptionElement: boolean;
  hasDescriptionElementSetter: (value: boolean) => void;
  hasErrorElement: boolean;
  hasErrorElementSetter: (value: boolean) => void;
}

export const entryContextDefault: EntryContextProps = {
  entryId: 'entry',
  entryBoxId: 'entry-box',
  entryInputId: 'entry-input',
  entryLabelId: 'entry-label',
  entryErrorId: 'entry-error',
  entryDescriptionId: 'entry-desc',
  entrySuggestionsId: 'entry-sugg',
  value: undefined,
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
  errorText: {
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
  },
  errored: false,
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
};

export const EntryContext = React.createContext<EntryContextProps>(entryContextDefault);

export default EntryContext;
