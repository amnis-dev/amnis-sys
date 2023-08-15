import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { kababize, noop } from '@amnis/state';
import type { EntryContextProps } from './EntryContext.js';
import { EntryContext, entryContextDefault } from './EntryContext.js';
import { Text, Number } from './inputs/index.js';
import type { EntrySchemaErrors, EntrySchemaNumber, EntrySchemaString } from './EntrySchemas.types.js';

export interface EntryProps {
  /**
   * The label of the entry.
   */
  label: string;

  /**
   * If the entry is required.
   */
  required?: boolean;

  /**
   * Text for errors.
   */
  errorText?: Record<EntrySchemaErrors, string>;

  /**
   * Optional text.
   */
  optionalText?: string;
}

export type EntryPropsVariations = {
  value?: string;
  type: 'text';
  schema: EntrySchemaString;
  onChange?: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
} | {
  value?: number;
  type: 'number';
  schema: EntrySchemaNumber;
  onChange?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const Entry: React.FC<EntryProps & EntryPropsVariations> = ({
  value: valueProp,
  label,
  type,
  schema,
  required = false,
  errorText = entryContextDefault.errorText,
  optionalText = entryContextDefault.optionalText,
  onChange: onChangeProp = noop,
}) => {
  const uid = React.useMemo(() => nanoid(4), []);

  const [value, setValue] = React.useState<typeof valueProp>(valueProp);

  React.useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const onChange = React.useCallback((
    valueNew: typeof valueProp,
    event: React.ChangeEvent,
  ) => {
    if (!valueProp) {
      setValue(valueNew);
    }
    onChangeProp(valueNew as any, event as any);
  }, [onChangeProp]);

  const ids = React.useMemo(() => {
    const labelKabab = `${kababize(label)}-${uid}`;

    return {
      entryId: labelKabab,
      entryBoxId: `${labelKabab}-box`,
      entryInputId: `${labelKabab}-input`,
      entryLabelId: `${labelKabab}-label`,
      entryErrorId: `${labelKabab}-error`,
      entryDescriptionId: `${labelKabab}-desc`,
      entrySuggestionsId: `${labelKabab}-sugg`,
    };
  }, [label, uid]);

  const errors = React.useMemo(() => {
    const result: EntrySchemaErrors[] = [];
    if (type === 'text' && typeof value === 'string') {
      const { maxLength, minLength, pattern } = schema;
      if (required && (!value || value.length === 0)) {
        result.push('required');
        return result;
      }

      if (!value) {
        return result;
      }

      if (maxLength && value.length > maxLength) {
        result.push('maxLength');
      }

      if (minLength && value.length < minLength) {
        result.push('minLength');
      }

      if (pattern && !RegExp(pattern).test(value)) {
        result.push('pattern');
      }
    }

    return result;
  }, [type, schema, required, value]);

  const errored = React.useMemo(() => errors.length > 0, [errors]);

  const labelInput = React.useMemo<string>(() => {
    const parts = [label];

    if (!required) {
      parts.push(optionalText);
    }

    if (errored) {
      parts.push('O');
    }

    return parts.join(' ');
  }, [label, required, errored, optionalText]);

  const contextValue = React.useMemo<EntryContextProps<typeof value>>(() => ({
    ...entryContextDefault,
    ...ids,
    value,
    label,
    labelInput,
    required,
    errors,
    errored,
    errorText,
    optionalText,
    onChange,
  }), [
    ids,
    value,
    label,
    required,
    errors,
    errored,
    errorText,
    optionalText,
    onChange,
  ]);

  return (
    <EntryContext.Provider value={contextValue}>
      {((): React.ReactNode => {
        switch (type) {
          case 'text':
            return <Text />;
          case 'number':
            return <Number />;
          default:
            return <span>&nbsp;</span>;
        }
      })()}
    </EntryContext.Provider>
  );
};
