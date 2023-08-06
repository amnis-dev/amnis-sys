import type { LogMinimal } from '../log/index.js';
import { uid } from '../../../core/uid.js';
import type {
  Locale, LocaleRoot, LocaleMinimal, LocaleTranslation, LocaleMeta,
} from './locale.types.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Data } from '../../data.types.js';
import {
  selectLocaleActiveCode,
  selectLocaleByCode,
  selectLocaleKeyExists,
  selectLocaleSet,
  selectLocaleTranslation,
} from './locale.selectors.js';

const localeKey = 'locale';

export const localeRoot: Omit<LocaleRoot, 'key'> = {
  code: 'en-us',
  set: 'system',
  t: {},
};

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

/**
 * Locale check method.
 */
export function localeCheck(locale: Locale): LogMinimal[] {
  const logs: LogMinimal[] = [];

  if (locale.code.length !== 2) {
    logs.push({
      title: 'Invalid Locale Code',
      description: 'Locale code must be a two-letter code for ISO 693 macrolanguage.',
      level: 'error',
    });
  }

  return logs;
}

export function localeCreate(
  locale: LocaleMinimal,
): Locale {
  return {
    ...localeRoot,
    ...locale,
    key: `${locale.code ?? localeRoot.code}:${locale.set ?? localeRoot.set}`,
    $id: uid(localeKey),
  };
}

/**
 * Meta object for the locale slice.
 */
const localeMeta: LocaleMeta = {
  code: 'en-us',
};

export const localeSlice = entitySliceCreate({
  key: localeKey,
  create: localeCreate,
  meta: localeMeta,
  selectors: {
    /**
     * Selects locales based on the active language code.
     */
    activeCode: selectLocaleActiveCode,

    /**
     * Selects locales based on the specified language code.
     */
    byCode: selectLocaleByCode,

    /**
     * Selects a single locale set.
     */
    set: selectLocaleSet,

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
