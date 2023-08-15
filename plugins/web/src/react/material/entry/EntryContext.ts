import React from 'react';
import { noop } from '@amnis/state';
import type { EntrySchemaErrors } from './EntrySchemas.types.js';

export interface EntryContextProps<T = any> {
  entryId: string;
  entryBoxId: string;
  entryInputId: string;
  entryLabelId: string;
  entryErrorId: string;
  entryDescriptionId: string;
  entrySuggestionsId: string;
  value: T | undefined;
  label: string;
  labelInput: string;
  description: string | null;
  errors: EntrySchemaErrors[];
  errored: boolean;
  errorText: Record<EntrySchemaErrors, string>;
  required: boolean;
  disabled: boolean;
  optionalText: string;
  focused: boolean;
  focusedSetter: (arg0: boolean) => void;
  suggestions: string[];
  suggestionFilter: string;
  suggestionFilterSetter: (arg0: string) => void;
  suggestionSelect: string | null;
  suggestionSelectSetter: (arg0: string | null) => void;
  onChange: (arg0: T, event: React.ChangeEvent<HTMLElement>) => void;
  hasLabelElement: boolean;
  hasLabelElementSetter: (arg0: boolean) => void;
  hasDescriptionElement: boolean;
  hasDescriptionElementSetter: (arg0: boolean) => void;
  hasErrorElement: boolean;
  hasErrorElementSetter: (arg0: boolean) => void;
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
  suggestions: [],
  suggestionFilter: '',
  suggestionFilterSetter: noop,
  suggestionSelect: null,
  suggestionSelectSetter: noop,
  required: false,
  disabled: false,
  focused: false,
  focusedSetter: noop,
  hasLabelElement: false,
  hasLabelElementSetter: noop,
  hasDescriptionElement: false,
  hasDescriptionElementSetter: noop,
  hasErrorElement: false,
  hasErrorElementSetter: noop,
  onChange: noop,
};

export const EntryContext = React.createContext<EntryContextProps>(entryContextDefault);

export default EntryContext;
