import React from 'react';
import { nanoid } from '@amnis/state/rtk';
import type { Schema } from '@amnis/state';
import { dataDefault, kababize, noop } from '@amnis/state';
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
  EntryArray,
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
   * If the entry should be auto focused when mounted.
   */
  autoFocus?: boolean;

  /**
   * Display in condensed mode.
   */
  condensed?: boolean;

  /**
   * Entry change event.
   */
  onChange?: (
    value: any | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  /**
   * Entry blur event.
   */
  onBlur?: EntryContextProps['onBlur'];

  /**
   * Entry focus event.
   */
  onFocus?: EntryContextProps['onFocus'];

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
  autoFocus = false,
  condensed = false,
  onChange: onChangeProp = noop,
  onBlur = noop,
  onFocus = noop,
}) => {
  const uid = React.useMemo(() => nanoid(4), []);
  const label = React.useMemo(() => labelProp ?? schema?.title ?? '', [labelProp, schema?.title]);
  const description = React.useMemo(
    () => descriptionProp ?? schema?.description ?? null,
    [descriptionProp, schema?.description],
  );

  const defaultObject = React.useMemo<Record<string, any>>(() => {
    if (schema?.type === 'object' && schema.properties) {
      return Object.keys(schema.properties).reduce<Record<string, any>>(
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
    }
    return {};
  }, [schema]);

  const [value, setValue] = React.useState<typeof valueProp>(() => {
    if (schema?.type === 'object' && schema.properties) {
      return { ...defaultObject, ...valueProp };
    }
    if (schema?.type) {
      return dataDefault(schema.type);
    }
    return valueProp;
  });

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

  const propertiesRequired = React.useMemo(
    () => {
      if (schema?.type === 'object' && !!schema.required) {
        return schema.required;
      }

      return [];
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [schema?.required],
  );

  const items = React.useMemo<Schema>(
    () => {
      if (schema?.type === 'array') {
        return schema.items ?? {
          $id: 'items',
          type: 'string',
        };
      }

      return {
        $id: 'items',
        type: 'string',
      };
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [schema?.items],
  );

  React.useEffect(() => {
    if (valueProp !== undefined) {
      if (type === 'object') {
        setValue({ ...defaultObject, ...valueProp });
        return;
      }
      setValue(valueProp);
    }
  }, [valueProp, defaultObject, type]);

  const onChange = React.useCallback((
    valueNew: typeof valueProp,
    event?: React.ChangeEvent,
  ) => {
    if (!valueProp) {
      if (type === 'object') {
        setValue({ ...defaultObject, ...valueNew });
      } else if (type === 'array') {
        setValue(valueNew);
      } else {
        setValue(valueNew);
      }
    }
    onChangeProp(valueNew as any, event as any);
  }, [onChangeProp, defaultObject, type]);

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
    propertiesRequired,
    items,
    label,
    labelInput,
    required,
    disabled,
    errors,
    errored,
    errorText,
    optionalText,
    autoFocus,
    condensed,
    onChange,
    onBlur,
    onFocus,
  }), [
    ids,
    value,
    properties,
    propertiesRequired,
    items,
    label,
    required,
    disabled,
    errors,
    errored,
    errorText,
    optionalText,
    autoFocus,
    condensed,
    onChange,
    onBlur,
    onFocus,
  ]);

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
          case 'array':
            return <EntryArray Entry={Entry}/>;
          case 'object':
            return <EntryObject Entry={Entry} />;
          default:
            return <Skeleton
              height={64}
              width="100%"
            />;
        }
      })()}
    </EntryContext.Provider>
  );
};
