import React from 'react';
import { nanoid } from '@amnis/state/rtk';
import type { Schema } from '@amnis/state';
import { kababize, localeSlice, noop } from '@amnis/state';
import { Skeleton } from '@mui/material';
import type {
  EntryContextProps,
  EntryContextSchemaErrors,
  EntryContextSchemaString,
  EntryContextTips,
} from '@amnis/web/react/context';
import {
  EntryContext, entryContextDefault, entryContextTipTextLocale, errorTextLocale,
} from '@amnis/web/react/context';
import { useWebSelector } from '@amnis/web/react/hooks';
import {
  EntryText,
  EntryNumber,
  EntryBoolean,
  EntryObject,
  EntryArray,
  EntryFormatReference,
  EntryFormatTree,
} from './inputs/index.js';

interface EntryBaseProps {
  /**
   * The label of the entry.
   */
  label?: string;

  /**
   * Hide the label.
   */
  labelHide?: boolean;

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
   * Options to filter out (if options are available)
   */
  optionsFilter?: any[];

  /**
   * Input lines for text entries.
   */
  multiline?: number;

  /**
   * Change data to pass to the entity's context.
   */
  changes?: EntryContextProps['changes'];

  /**
   * Entry change event.
   */
  onChange?: (
    value: any | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  /**
   * Entry select event.
   */
  onSelect?: (
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

  /**
   * Entry error event.
   */
  onError?: EntryContextProps['onError'];

}

type EntryPropsVariations = {
  value?: string;
  optionsFilter?: string[];
  onChange?: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelect?: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLElement>
  ) => void;
} | {
  value?: number;
  optionsFilter?: number[];
  onChange?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelect?: (
    value: number | undefined,
    event: React.ChangeEvent<HTMLElement>
  ) => void;
} | {
  value?: boolean;
  optionsFilter?: boolean[];
  onChange?: (
    value: boolean | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelect?: (
    value: boolean | undefined,
    event: React.ChangeEvent<HTMLElement>
  ) => void;
} | {
  value?: object;
  optionsFilter?: object[];
  onChange?: (
    value: object | undefined,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelect?: (
    value: object | undefined,
    event: React.ChangeEvent<HTMLElement>
  ) => void;
}

export type EntryProps = EntryBaseProps & EntryPropsVariations;

export const Entry: React.FC<EntryProps> = ({
  value,
  label: labelProp,
  labelHide = false,
  description: descriptionProp,
  schema,
  required = false,
  disabled = false,
  errorText: errorTextProp,
  optionalText = entryContextDefault.optionalText,
  autoFocus = false,
  condensed = false,
  multiline: multilineProp,
  changes,
  optionsFilter = [],
  onChange: onChangeProp = noop,
  onSelect: onSelectProp = noop,
  onBlur = noop,
  onFocus = noop,
  onError = noop,
}) => {
  const localeCode = useWebSelector(localeSlice.select.activeCode);

  const uid = React.useMemo(() => nanoid(4), []);
  const label = React.useMemo(() => labelProp ?? schema?.title ?? '', [labelProp, schema?.title]);
  const description = React.useMemo(
    () => descriptionProp ?? schema?.description ?? null,
    [descriptionProp, schema?.description],
  );

  const format = React.useMemo(() => {
    if (schema?.type === 'string') {
      return schema.format;
    }

    return undefined;
  }, [schema?.type, schema?.format]);

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
  }, [schema?.type, value]);

  const properties = React.useMemo(
    () => {
      if (schema?.type === 'object' && !!schema.properties) {
        return Object.keys(schema.properties).map((propertyKey) => {
          const property = schema.properties![propertyKey];
          return {
            ...property,
            key: propertyKey,
          } as Schema & { key: string };
        }).filter(
          (property) => !property.key.startsWith('_') && !property.key.startsWith('$_'),
        );
      }

      return [];
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [schema?.properties, schema?.type],
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
        return schema.items as Schema ?? {
          $id: 'items',
          type: 'string',
        } as Schema;
      }

      return {
        $id: 'items',
        type: 'string',
      } as Schema;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    [schema?.items],
  );

  const pattern = React.useMemo(() => {
    if (schema?.type === 'string') {
      return schema.pattern;
    }

    return undefined;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
  }, [schema?.pattern]);

  const uniqueItems = React.useMemo<boolean>(() => {
    if (schema?.type === 'array') {
      return schema.uniqueItems ?? false;
    }

    return false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
  }, [schema?.uniqueItems]);

  const onChange = React.useCallback((
    valueNew: typeof value,
    event?: React.ChangeEvent,
  ) => {
    if (!required && valueNew === '') {
      onChangeProp(undefined, event as any);
      return;
    }
    onChangeProp(valueNew as any, event as any);
  }, [onChangeProp, required]);

  const onSelect = React.useCallback((
    valueNew: typeof value,
    event?: React.ChangeEvent,
  ) => {
    onSelectProp(valueNew, event as any);
  }, [onSelectProp]);

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
      if (required && (value === undefined || value.length === 0)) {
        result.push('required');
        return result;
      }

      if (value === undefined) {
        return result;
      }

      if (!required && value.length === 0) {
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

  const multiline = React.useMemo<number | undefined>(() => {
    if (multilineProp) {
      return multilineProp;
    }

    if (type === 'string' && schema) {
      const { maxLength } = schema as EntryContextSchemaString;

      if (!maxLength) {
        return undefined;
      }

      if (maxLength > 2048) {
        return 8;
      }

      return Math.floor(maxLength / 256);
    }

    return undefined;
  }, [multilineProp, schema, type]);

  const errorText = React.useMemo<Record<EntryContextSchemaErrors, string>>(() => {
    if (errorTextProp) {
      return errorTextProp;
    }

    if (!errorTextLocale[localeCode as keyof typeof errorTextLocale]) {
      return errorTextLocale.en;
    }

    return errorTextLocale[localeCode as keyof typeof errorTextLocale];
  }, [localeCode, errorTextProp]);

  const tipText = React.useMemo<Record<EntryContextTips, string>>(() => {
    if (!entryContextTipTextLocale[localeCode as keyof typeof entryContextTipTextLocale]) {
      return entryContextTipTextLocale.en;
    }

    return entryContextTipTextLocale[localeCode as keyof typeof entryContextTipTextLocale];
  }, [localeCode, errorTextProp]);

  const errored = React.useMemo(() => errors.length > 0, [errors.length]);

  /**
   * Trigger the onError callback if the entry errors change.
   */
  React.useEffect(() => {
    onError(errors);
  }, [JSON.stringify(errors)]);

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
    pattern,
    properties,
    propertiesRequired,
    items,
    uniqueItems,
    optionsFilter,
    label,
    labelInput,
    labelHide,
    required,
    disabled,
    errors,
    errored,
    errorText,
    tipText,
    optionalText,
    autoFocus,
    condensed,
    changes,
    multiline,
    onChange,
    onSelect,
    onBlur,
    onFocus,
  }), [
    ids,
    value,
    pattern,
    properties,
    propertiesRequired,
    items,
    uniqueItems,
    optionsFilter,
    label,
    labelInput,
    labelHide,
    required,
    disabled,
    errors,
    errored,
    errorText,
    tipText,
    optionalText,
    autoFocus,
    condensed,
    changes,
    multiline,
    onChange,
    onSelect,
    onBlur,
    onFocus,
  ]);

  return (
    <EntryContext.Provider value={contextValue}>
      {((): React.ReactNode => {
        switch (format) {
          case 'reference':
            return <EntryFormatReference />;
          default:
        }

        switch (type) {
          case 'string':
            return <EntryText />;
          case 'number':
            return <EntryNumber />;
          case 'boolean':
            return <EntryBoolean />;
          case 'array':
            if (items?.type === 'array') {
              return <EntryFormatTree />;
            }
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
