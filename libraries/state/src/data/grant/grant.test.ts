import type { State } from '../../state.types.js';
import {
  grantCombine, grantStateFilter, grantStateScope, grantTask,
} from './grant.js';
import type { Grant } from './grant.types.js';
import { GrantScope, GrantTask } from './grant.types.js';

/**
 * Begin test...
 */
test('should combine similar grants', () => {
  /**
   * Setup test data.
   */
  const grants1: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 0, 0, 0)],
    ['slice1', GrantScope.Global, grantTask(0, 0, 1, 1)],
    ['slice1', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];

  const grants1Result: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 1, 1, 1)],
  ];

  // ----------

  const grants2: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 0, 0, 0)],
    ['slice1', GrantScope.Global, grantTask(0, 0, 1, 1)],
    ['slice1', GrantScope.Owned, grantTask(0, 1, 1, 0)],
  ];

  const grants2Result: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 0, 1, 1)],
    ['slice1', GrantScope.Owned, grantTask(0, 1, 1, 0)],
  ];

  // ----------

  const grants3: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 0, 0, 0)],
    ['slice1', GrantScope.Global, grantTask(0, 0, 1, 1)],
    ['slice2', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];

  const grants3Result: Grant[] = [
    ['slice1', GrantScope.Global, grantTask(1, 0, 1, 1)],
    ['slice2', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];

  // ----------

  const result1 = grantCombine(grants1);
  expect(result1).toEqual(grants1Result);

  const result2 = grantCombine(grants2);
  expect(result2).toEqual(grants2Result);

  const result3 = grantCombine(grants3);
  expect(result3).toEqual(grants3Result);
});

test('should filter a state based on a task and list of grants', () => {
  const state: State = {
    a: {}, // Should always exist.
    b: {},
    c: {},
    d: {},
    e: {},
    f: {}, // Should never exist.
  };

  const grants: Grant[] = [
    ['a', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['b', GrantScope.Global, grantTask(0, 1, 1, 1)],
    ['c', GrantScope.Global, grantTask(1, 0, 1, 1)],
    ['d', GrantScope.Global, grantTask(1, 1, 0, 1)],
    ['e', GrantScope.Global, grantTask(1, 1, 1, 0)],
    ['f', GrantScope.Global, grantTask(0, 0, 0, 0)],
  ];

  const filter1 = grantStateFilter(grants, GrantTask.Create, state);

  expect(filter1).toEqual({
    a: {},
    c: {},
    d: {},
    e: {},
  });

  const filter2 = grantStateFilter(grants, GrantTask.Read, state);

  expect(filter2).toEqual({
    a: {},
    b: {},
    d: {},
    e: {},
  });

  const filter3 = grantStateFilter(grants, GrantTask.Update, state);

  expect(filter3).toEqual({
    a: {},
    b: {},
    c: {},
    e: {},
  });

  const filter4 = grantStateFilter(grants, GrantTask.Delete, state);

  expect(filter4).toEqual({
    a: {},
    b: {},
    c: {},
    d: {},
  });

  const filter5 = grantStateFilter(grants, GrantTask.None, state);

  expect(filter5).toEqual({});
});

test('should create a state scope based on a task and a list of grants', () => {
  const grants: Grant[] = [
    ['a', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['b', GrantScope.Global, grantTask(0, 1, 1, 1)],
    ['c', GrantScope.Global, grantTask(1, 0, 1, 1)],
    ['d', GrantScope.Global, grantTask(1, 1, 0, 1)],
    ['e', GrantScope.Global, grantTask(1, 1, 1, 0)],
    ['f', GrantScope.Global, grantTask(0, 0, 0, 0)],
    ['b', GrantScope.Group, grantTask(0, 1, 0, 0)],
    ['d', GrantScope.Group, grantTask(0, 1, 0, 0)],
    ['f', GrantScope.Group, grantTask(0, 1, 0, 0)],
    ['a', GrantScope.Owned, grantTask(1, 1, 1, 1)],
    ['c', GrantScope.Owned, grantTask(0, 1, 0, 0)],
    ['e', GrantScope.Owned, grantTask(0, 0, 0, 1)],
    ['e', GrantScope.Owned, grantTask(0, 0, 0, 1)],
  ];

  const scope1 = grantStateScope(grants, GrantTask.Create);

  expect(scope1).toEqual({
    a: GrantScope.Global,
    c: GrantScope.Global,
    d: GrantScope.Global,
    e: GrantScope.Global,
  });

  const scope2 = grantStateScope(grants, GrantTask.Read);

  expect(scope2).toEqual({
    a: GrantScope.Global,
    b: GrantScope.Global,
    c: GrantScope.Owned,
    d: GrantScope.Global,
    e: GrantScope.Global,
    f: GrantScope.Group,
  });

  const scope3 = grantStateScope(grants, GrantTask.Update);

  expect(scope3).toEqual({
    a: GrantScope.Global,
    b: GrantScope.Global,
    c: GrantScope.Global,
    e: GrantScope.Global,
  });

  const scope4 = grantStateScope(grants, GrantTask.Delete);

  expect(scope4).toEqual({
    a: GrantScope.Global,
    b: GrantScope.Global,
    c: GrantScope.Global,
    d: GrantScope.Global,
    e: GrantScope.Owned,
  });
});
