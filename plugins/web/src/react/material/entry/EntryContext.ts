import React from 'react';
import { noop } from '@amnis/state';

export interface EntryContextType<T> {
  entryId: string;
  entryBoxId: string;
  entryInputId: string;
  entryLabelId: string;
  entryErrorId: string;
  entryDescriptionId: string;
  entrySuggestionsId: string;
  value: T;
  label: string;
  description: string;
  errors: string[];
  required: boolean;
  disabled: boolean;
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

export const entryContextDefault: EntryContextType<unknown> = {
  entryId: 'entry',
  entryBoxId: 'entry-box',
  entryInputId: 'entry-input',
  entryLabelId: 'entry-label',
  entryErrorId: 'entry-error',
  entryDescriptionId: 'entry-desc',
  entrySuggestionsId: 'entry-sugg',
  value: null,
  label: 'unlabelled',
  description: '',
  errors: [],
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

export const EntryContext = React.createContext<EntryContextType<unknown>>(entryContextDefault);

export default EntryContext;
