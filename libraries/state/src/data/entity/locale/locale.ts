import type { LogMinimal } from '../log/index.js';
import { uid } from '../../../core/index.js';
import type {
  Locale, LocaleRoot, LocaleMinimal, LocaleTranslationKey, LocaleTranslation,
} from './locale.types.js';
import { entitySliceCreate } from '../entity.slice.js';

const localeKey = 'locale';

export const localeRoot: LocaleRoot = {
  code: 'en',
  set: 'core',
  t: {},
  v: [],
};

/**
 * defines a translation key
 */
export function tk(key: string) {
  return key as LocaleTranslationKey;
}

/**
 * Translate method
 */
export function t(
  translations: LocaleTranslation,
  key: LocaleTranslationKey,
  ...args: string[]
) {
  if (key.length > 64) {
    return key;
  }
  if (typeof translations[key] !== 'string') {
    return key;
  }
  return translations[key].replace(
    /{(\d+)}/g,
    (match, number) => (
      typeof args[number] !== 'undefined' ? args[number] : match
    ),
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
    $id: uid(localeKey),
  };
}

export const localeSlice = entitySliceCreate({
  key: localeKey,
  create: localeCreate,
});
