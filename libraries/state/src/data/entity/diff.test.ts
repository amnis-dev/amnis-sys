import { diffChanges, diffCompare } from './diff.js';

test('should have no differences between equal objects', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: [...obj1.array],
    object: { ...obj1.object },
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(0);
});

test('should show difference in string value', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: [...obj1.array],
    object: { ...obj1.object },
    string: 'something else',
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('string');
});

test('should show difference in number value', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: [...obj1.array],
    object: { ...obj1.object },
    number: 3,
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('number');
});

test('should show difference in boolean value', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: [...obj1.array],
    object: { ...obj1.object },
    boolean: false,
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('boolean');
});

test('should show difference in array value', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: ['a', 2, true],
    object: { ...obj1.object },
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('array');
});

test('should show difference in array when array is empty', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: [] as (string | number | boolean)[],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: ['a', 2, true],
    object: { ...obj1.object },
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('array');
});

test('should show difference in object value', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    ...obj1,
    array: [...obj1.array],
    object: { a: 'a', b: 2, c: false },
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(1);
  expect(diffResult[0]).toBe('object');
});

test('should show difference in multiple properties', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };
  const obj2 = {
    string: 'new',
    number: 777,
    boolean: false,
    array: ['b', 1, true],
    object: { a: 'b', b: 2, c: true },
  };

  const diffResult = diffCompare(obj1, obj2);
  expect(diffResult).toHaveLength(5);
  expect(diffResult).toEqual(expect.arrayContaining(Object.keys(obj1)));
});

test('should create a comparison object with differenced properties', () => {
  const obj1 = {
    string: 'string',
    number: 4,
    boolean: true,
    array: ['a', 1, true],
    object: { a: 'a', b: 2, c: true },
  };

  const obj2 = {
    ...obj1,
    number: 7,
    string: 'new',
    array: ['b', 2, true],
    object: { ...obj1.object },
  };

  const diffResult = diffChanges(obj1, obj2);
  expect(Object.keys(diffResult)).toHaveLength(2);
  expect(Object.keys(diffResult.original)).toHaveLength(3);
  expect(Object.keys(diffResult.current)).toHaveLength(3);
  expect(Object.keys(diffResult.original)).toEqual(expect.arrayContaining(['number', 'string', 'array']));
  expect(Object.keys(diffResult.current)).toEqual(expect.arrayContaining(['number', 'string', 'array']));
});
