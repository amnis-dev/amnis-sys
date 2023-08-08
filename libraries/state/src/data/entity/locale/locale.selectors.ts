import { createSelector } from '@reduxjs/toolkit';
import type { Data, DataMeta, DataState } from '../../data.types.js';
import type { State } from '../../../state.types.js';
import type { LocaleMeta, Locale } from './locale.types.js';
import type { Entity } from '../entity.types.js';

/**
 * Selects the locale slice state.
 */
export const selectLocaleState = (
  state: State<any>,
): LocaleMeta & DataState<Entity<Locale>> => state.locale;

/**
 * Determines if a tranlsation key exists.
 */
export const selectLocaleCodeNameExists = createSelector(
  [
    selectLocaleState,
    (state: State<any>, code: string) => code,
    (state: State<any>, code, name: string) => name,
  ],
  (localeState, code, name) => Object.values(localeState.entities).some(
    (locale) => locale.code === code && locale.name === name,
  ),
);

/**
 * Selects the locale slice state.
 */
export const selectLocaleSystemDefaultCode = (
  state: State<any>,
): string => {
  const systemActiveId = state.system?.active;
  if (!systemActiveId) {
    return 'en';
  }
  return state.system.entities[systemActiveId].languages[0] ?? 'en';
};

/**
 * Selects the locale slice state.
 */
export const selectLocaleActiveCode = createSelector(
  selectLocaleState,
  (localeState) => localeState.code,
);

/**
 * Selects a locale entities of the active language code.
 */
export const selectLocaleActive = createSelector(
  [
    selectLocaleState,
    selectLocaleSystemDefaultCode,
  ],
  (localeState, defaultCode) => {
    const { code } = localeState;
    const locales = Object.values(localeState.entities).filter((locale) => locale.code === code);
    if (locales.length === 0) {
      const defaultLocales = Object.values(localeState.entities).filter(
        (locale) => locale.code === defaultCode,
      );
      return defaultLocales;
    }
    return locales;
  },
);

/**
 * Selects a locale entities by code.
 */
export const selectLocaleByCode = createSelector(
  [
    selectLocaleState,
    (state: State<any>, code: string) => code,
  ],
  (localeState, code) => Object
    .values(localeState.entities)
    .filter((locale) => locale.code === code),
);

/**
 * Selects a locale by name.
 */
export const selectLocaleByName = createSelector(
  [
    selectLocaleActive,
    (state: State<any>, name: string) => name,
  ],
  (localeCodeEntities, name) => localeCodeEntities.find((locale) => locale.name === name),
);

/**
 * Selects a locale by name.
 */
export const selectLocaleByCodeName = createSelector(
  [
    (state: State<any>) => state,
    (state, code: string) => code,
    (state, code, name: string) => name,
  ],
  (state, code, name) => {
    const codes = selectLocaleByCode(state, code);
    return codes.find((c) => c.name === name);
  },
);

/**
 * Selects an array of locales by names.
 */
export const selectLocaleByCodeNames = createSelector(
  [
    (state: State<any>) => state,
    (state: State<any>, code: string) => code,
    (state: State<any>, code: string, names: string[]) => names,
  ],
  (state, code, names) => {
    const codes = selectLocaleByCode(state, code);
    return codes.filter((c) => names.includes(c.name));
  },
);

/**
 * Selects a locale translation key value by a local reference
 *
 * Expressions are in the format of:
 * %<set>:<name>
 */
export const selectLocaleValue = createSelector(
  [
    selectLocaleActive,
    (state: State<any>, reference: string) => reference,
  ],
  (localeCodeEntities, reference): string | undefined => {
    const name = reference.substring(1);
    if (!name) {
      return undefined;
    }
    const locale = localeCodeEntities.find((locale) => locale.name === name);
    if (!locale) {
      return undefined;
    }
    return locale.value;
  },
);

/**
 * Selects a full locale translation by a local reference with an optional context object.
 */
export const selectLocaleTranslation = createSelector(
  [
    (state) => state,
    (state, reference: string): string | undefined => {
      const localeState = selectLocaleState(state);
      const name = reference.slice(1);
      if (!name) {
        return undefined;
      }
      const locale = localeState.names[name];
      return locale?.value;
    },
    (state, reference: string, context?: Record<string, any> | undefined) => context,
  ],
  (state, value, context): string | undefined => {
    if (!value) {
      return undefined;
    }

    return value.replace(
      /{.+?}/g,
      (match) => {
        const [operation, dataKey, prop] = match.substring(1, match.length - 1).split('.');

        if (!operation || !dataKey || !prop) {
          return '\u25FC';
        }

        const dataState = state[dataKey] as DataMeta & DataState<Data>;
        if (!dataState) {
          return '\u25FC';
        }

        let data: Record<string, any> | undefined;

        /**
         * Context operation.
         */
        if (operation === 'context') {
          data = context;
        }

        /**
         * Active operation.
         */
        if (operation === 'active') {
          const activeId = dataState.active;
          if (!activeId) {
            return '\u25FC';
          }

          data = dataState.entities[activeId];
        }

        if (!data) {
          return '\u25FC';
        }

        const variable = data[prop];

        if (typeof value === 'string') {
          return variable;
        }
        if (typeof value === 'number') {
          return variable.toString();
        }
        if (typeof value === 'boolean') {
          return variable ? 'true' : 'false';
        }

        return '◼';
      },
    );
  },
);
