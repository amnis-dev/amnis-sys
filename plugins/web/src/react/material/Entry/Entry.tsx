import React from 'react';
import { nanoid } from '@amnis/state/rtk';
import type { Schema } from '@amnis/state';
import { kababize, noop } from '@amnis/state';
import { Skeleton } from '@mui/material';
import type {
  EntryContextProps,
  EntryContextSchemaErrors,
  EntryContextSchemaString,
} from '@amnis/web/react/context';
import { EntryContext, entryContextDefault } from '@amnis/web/react/context';
import {
  EntryText,
  EntryNumber,
  EntryBoolean,
  EntryObject,
} from './inputs/index.js';

interface EntryBaseProps {
  /**
   * The label of the entry.
   */
  label?: string;

  /**
   * The description of the entry.
   */
  description?: string;

  /**
   * If the entry is required.
   */
  required?: boolean;

  /**
   * Disables the entry.
   */
  disabled?: boolean;

  /**
   * Text for errors.
   */
  errorText?: Record<EntryContextSchemaErrors, string>;

  /**
   * Optional text.
   */
  optionalText?: string;

  /**
   * Entry schema.
   */
  schema?: Schema;

  /**
   * Entry value.
   */
  value?: any;

  /**
   * Entry change handler.
   */
  onChange?: (
    value: any | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

type EntryPropsVariations = {
  value?: string;
  onChange?: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
} | {
  value?: number;
  onChange?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
} | {
  value?: boolean;
  onChange?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
} | {
  value?: object;
  onChange?: (
    value: object | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export type EntryProps = EntryBaseProps & EntryPropsVariations;

export const Entry: React.FC<EntryProps> = ({
  value: valueProp,
  label: labelProp,
  description: descriptionProp,
  schema,
  required = false,
  disabled = false,
  errorText = entryContextDefault.errorText,
  optionalText = entryContextDefault.optionalText,
  onChange: onChangeProp = noop,
}) => {
  const uid = React.useMemo(() => nanoid(4), []);
  const label = React.useMemo(() => labelProp ?? schema?.title ?? 'Unlabeled', [labelProp]);
  const description = React.useMemo(
    () => descriptionProp ?? schema?.description ?? null,
    [descriptionProp],
  );

  const [value, setValue] = React.useState<typeof valueProp>(() => {
    if (schema?.type === 'object' && schema.properties) {
      const valueInitial = Object.keys(schema.properties).reduce<Record<string, any>>(
        (acc, propertyKey) => {
          const property = schema.properties![propertyKey];
          if (property.default) {
            return { ...acc, [propertyKey]: property.default };
          }
          switch (property.type) {
            case 'string': return { ...acc, [propertyKey]: '' };
            case 'number': return { ...acc, [propertyKey]: 0 };
            case 'boolean': return { ...acc, [propertyKey]: false };
            case 'array': return { ...acc, [propertyKey]: [] };
            case 'object': return { ...acc, [propertyKey]: {} };
            default: return { ...acc, [propertyKey]: null };
          }
        },
        {},
      );
      console.log({ valueInitial });
      return valueInitial;
    }
    if (schema?.type === 'array') {
      return [];
    }
    return valueProp;
  });

  const properties = React.useMemo(
    () => {
      if (schema?.type === 'object' && !!schema.properties) {
        return Object.keys(schema.properties).map((propertyKey) => {
          const property = schema.properties![propertyKey];
          return {
            ...property,
            key: propertyKey,
          };
        });
      }

      return [];
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [schema?.properties],
  );

  React.useEffect(() => {
    if (valueProp !== undefined) {
      setValue(valueProp);
    }
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
    description,
    value,
    properties,
    label,
    labelInput,
    required,
    disabled,
    errors,
    errored,
    errorText,
    optionalText,
    onChange,
  }), [
    ids,
    value,
    properties,
    label,
    required,
    disabled,
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

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    return 'none';
  }, [schema]);

  return (
    <EntryContext.Provider value={contextValue}>
      {((): React.ReactNode => {
        switch (type) {
          case 'string':
            return <EntryText />;
          case 'number':
            return <EntryNumber />;
          case 'boolean':
            return <EntryBoolean />;
          case 'object':
            return <EntryObject Entry={Entry} />;
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
