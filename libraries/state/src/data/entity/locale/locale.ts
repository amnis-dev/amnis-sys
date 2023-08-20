import type { PayloadAction } from '@amnis/state/rtk';
import { createAction } from '@amnis/state/rtk';
import { uid } from '../../../core/uid.js';
import type {
  Locale, LocaleRoot, LocaleMinimal, LocaleMeta,
} from './locale.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import {
  selectLocaleActive,
  selectLocaleActiveCode,
  selectLocaleByCode,
  selectLocaleByCodeName,
  selectLocaleByCodeNames,
  selectLocaleByName,
  selectLocaleSystemDefaultCode,
  selectLocaleTranslation,
} from './locale.selectors.js';
import { dataActions } from '../../data.actions.js';
import type { Entity } from '../entity.types.js';
import type { DataCreator } from '../../data.types.js';
import { entityCreate } from '../entity.js';
import { localStorage } from '../../../localstorage.js';

const localeKey = 'locale';

export const localeRoot: () => Omit<LocaleRoot, 'key'> = () => ({
  code: 'en',
  name: 'name',
  value: 'value',
});

export function localeCreate(
  locale: LocaleMinimal,
): Locale {
  return {
    ...localeRoot(),
    ...locale,
    $id: uid(localeKey),
  };
}

/**
 * Convenience function to create multiple locale entities
 * using a single object.
 */
export function localeDocumentToEntities(
  code: string,
  locales: Record<string, string>,
): Entity<Locale>[] {
  return Object.keys(locales).map((name) => (entityCreate<Locale>(localeCreate({
    code,
    name,
    value: locales[name],
  }))));
}

/**
 * Meta object for the locale slice.
 */
const localeMeta: LocaleMeta = {
  code: localStorage().getItem('locale-code') ?? (
    typeof window === 'object' ? window.navigator.language ?? 'en' : 'en'
  ),
  names: {},
};

/**
 * Additional Locale Actions
 */
const localeActions = {
  /**
   * Sets the default locale code.
   */
  codeSet: createAction(`${localeKey}/codeSet`, (code: string) => ({
    payload: code,
  })),

  /**
   * Inserts locale data into the slice.
   */
  insertData: createAction(`${localeKey}/insertData`, (locales: Locale[]) => ({
    payload: locales,
  })),
};

export const localeSlice = entitySliceCreate({
  key: localeKey,
  create: localeCreate,
  meta: localeMeta,
  /**
   * Sort locale by code. A-Z.
   */
  sort: (a, b) => a.code.localeCompare(b.code),
  actions: localeActions,
  reducersExtras: [{
    cases: ({
      builder,
    }) => {
      builder.addCase(localeActions.codeSet, (state: LocaleMeta, action) => {
        state.code = action.payload;
        localStorage().setItem('locale-code', action.payload);
      });

      builder.addCase(localeActions.insertData, (state: LocaleMeta, action) => {
        const locales = action.payload;

        state.names = {
          ...state.names,
          ...locales.reduce <Record<string, Locale>>((acc, cur) => {
            acc[cur.name] = cur;
            return acc;
          }, {}),
        };
      });
    },
    matchers: ({
      builder,
    }) => {
      builder.addMatcher(
        (action): action is PayloadAction<DataCreator<Entity>> => (
          action.type === dataActions.insert.type || action.type === dataActions.create.type
        ),
        (state, action) => {
          if (!action.payload?.locale) {
            return;
          }
          const locales = action.payload.locale as Entity<Locale>[];

          state.names = {
            ...state.names,
            ...locales.reduce <Record<string, Locale>>((acc, cur) => {
              acc[cur.name] = {
                $id: cur.$id,
                code: cur.code,
                name: cur.name,
                value: cur.value,
              };
              return acc;
            }, {}),
          };
        },
      );
    },
  }],
  selectors: {

    /**
     * Selects the defaut locale code.
     */
    defaultCode: selectLocaleSystemDefaultCode,

    /**
     * Selects the defaut locale code.
     */
    activeCode: selectLocaleActiveCode,

    /**
     * Selects locales based on the active language code.
     */
    activeLocale: selectLocaleActive,

    /**
     * Selects locales based on the specified language code.
     */
    byCode: selectLocaleByCode,

    /**
     * Selects a locale by name.
     */
    byName: selectLocaleByName,

    /**
     * Selects a locale by code and name.
     */
    byCodeName: selectLocaleByCodeName,

    /**
     * Selects a locale by code and name.
     */
    byCodeNames: selectLocaleByCodeNames,

    /**
     * Select a transation given the expression.
     */
    translation: selectLocaleTranslation,
  },
});
