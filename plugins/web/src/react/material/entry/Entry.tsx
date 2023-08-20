import React from 'react';
import { nanoid } from '@amnis/state/rtk';
import { kababize, noop } from '@amnis/state';
import { Skeleton } from '@mui/material';
import type {
  EntryContextProps,
  EntryContextSchemaErrors,
  EntryContextSchemaNumber,
  EntryContextSchemaString,
} from '@amnis/web/react/context';
import { EntryContext, entryContextDefault } from '@amnis/web/react/context';
import { Text, Number } from './inputs/index.js';

export interface EntryProps {
  /**
   * The label of the entry.
   */
  label: string;

  /**
   * Controlled value of the input.
   */
  value?: unknown;

  /**
   * If the entry is required.
   */
  required?: boolean;

  /**
   * Text for errors.
   */
  errorText?: Record<EntryContextSchemaErrors, string>;

  /**
   * Optional text.
   */
  optionalText?: string;
}

export type EntryPropsVariations = {
  schema?: EntryContextSchemaString;
  onChange?: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
} | {
  schema?: EntryContextSchemaNumber;
  onChange?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const Entry: React.FC<EntryProps & EntryPropsVariations> = ({
  value: valueProp,
  label,
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

  const errors = React.useMemo<EntryContextSchemaErrors[]>(() => {
    const result: EntryContextSchemaErrors[] = [];
    if (!schema) {
      return result;
    }

    if (typeof value === 'string') {
      const { maxLength, minLength, pattern } = schema as EntryContextSchemaString;
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
  }, [schema, required, value]);

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

  const type = React.useMemo(() => {
    if (schema) {
      return schema.type;
    }

    if (typeof value === 'string') {
      return 'string';
    }

    if (typeof value === 'number') {
      return 'number';
    }

    return 'none';
  }, [schema]);

  return (
    <EntryContext.Provider value={contextValue}>
      {((): React.ReactNode => {
        switch (type) {
          case 'string':
            return <Text />;
          case 'number':
            return <Number />;
          default:
            return <Skeleton
              height={32}
              width="100%"
            />;
        }
      })()}
    </EntryContext.Provider>
  );
};
