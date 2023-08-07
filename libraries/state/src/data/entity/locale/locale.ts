import { uid } from '../../../core/uid.js';
import type {
  Locale, LocaleRoot, LocaleMinimal, LocaleTranslation, LocaleMeta,
} from './locale.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Data } from '../../data.types.js';
import {
  selectLocaleActiveCode,
  selectLocaleByCode,
  selectLocaleByKey,
  selectLocaleByKeys,
  selectLocaleByName,
  selectLocaleKeyExists,
  selectLocaleTranslation,
} from './locale.selectors.js';

const localeKey = 'locale';

export const localeRoot: () => Omit<LocaleRoot, 'key'> = () => ({
  code: 'en',
  name: 'name',
  value: 'value',
});

/**
 * Translate method
 */
export function t(
  translations: LocaleTranslation,
  key: string,
  data: Data & Record<string, any> = { $id: uid('data') },
) {
  if (key.length > 64) {
    return key;
  }

  const translation = translations[key];
  if (translation !== 'string') {
    return key;
  }

  return translation.replace(
    /{.+?}/g,
    (match) => {
      const prop = match.substring(1, match.length - 1);
      const value = data[prop];

      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'number') {
        return value.toString();
      }
      if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      }

      return '◼';
    },
  );
}

export function localeCreate(
  locale: LocaleMinimal,
): Locale {
  return {
    ...localeRoot(),
    ...locale,
    key: `${locale.code}:${locale.name}`,
    $id: uid(localeKey),
  };
}

/**
 * Meta object for the locale slice.
 */
const localeMeta: LocaleMeta = {
  code: 'en',
};

export const localeSlice = entitySliceCreate({
  key: localeKey,
  create: localeCreate,
  meta: localeMeta,
  selectors: {
    /**
     * Selects a locale by key.
     */
    byKey: selectLocaleByKey,

    /**
     * Selects an array of locale by keys.
     */
    byKeys: selectLocaleByKeys,

    /**
     * Selects locales based on the active language code.
     */
    activeCode: selectLocaleActiveCode,

    /**
     * Selects locales based on the specified language code.
     */
    byCode: selectLocaleByCode,

    /**
     * Selects a locale by name.
     */
    byName: selectLocaleByName,

    /**
     * Select a transation given the expression.
     */
    translation: selectLocaleTranslation,

    /**
     * Checks if a translation key exists.
     */
    keyExists: selectLocaleKeyExists,
  },
});
