import { dataActions } from '../../data.actions.js';
import { storeSetup } from '../../../store.js';
import { uid } from '../../../core/index.js';
import { systemSlice } from '../system/index.js';
import {
  localeCreate, localeSlice,
} from './locale.js';
import { localeDataEnCreate } from './locale.locale.en.js';

const system = systemSlice.createEntity({
  name: 'My Locale System',
  $adminRole: uid('role'),
  $execRole: uid('role'),
});

const store = storeSetup();
store.dispatch(systemSlice.action.insert(system));
store.dispatch(systemSlice.action.activeSet(system.$id));
store.dispatch(dataActions.create(localeDataEnCreate));

/**
 * ============================================================
 */
test('locale key should be is properly set', () => {
  expect(localeSlice.key).toEqual('locale');
});

/**
 * ============================================================
 */
test('should create a locale', () => {
  const locale = localeCreate({
    code: 'en',
    name: 'my_locale_name',
    value: 'My Locale Value',
  });

  expect(locale).toEqual(
    expect.objectContaining({
      code: 'en',
      name: 'my_locale_name',
      value: 'My Locale Value',
    }),
  );
});

/**
 * ============================================================
 */
test('should select translated expression', () => {
  const translation = localeSlice.select.translation(store.getState(), '%error_required_name_desc');
  expect(translation).toEqual('The system "My Locale System" needs a name.');
});

/**
 * ============================================================
 */
test('should use unicode block if variable is not found', () => {
  const translation = localeSlice.select.translation(store.getState(), '%error_required_name_desc_bad_var');
  expect(translation).toEqual('The system "\u25FC" needs a name.');
});
