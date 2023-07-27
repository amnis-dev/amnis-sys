import {
  uid, uidList, uidListValidate, uidTree, uidTreeValidate, uidValidate,
} from './uid.js';
import { regexUuid } from './regex.js';
import type { UID } from './core.types.js';

test('should generate a unique identifier', () => {
  const id = uid('identity');
  const [type, uuid] = id.split(':');

  expect(type).toBe('identity');
  expect(regexUuid.test(uuid)).toBe(true);
});

test('should distinguish between a valid and invalid uid', () => {
  const idValid = uid('slice');
  const idInvalid1 = '' as UID;
  const idInvalid2 = 'slice:' as UID;
  const idInvalid3 = 'slice:notauuid' as UID;

  expect(uidValidate(idValid)).toBe(true);
  expect(uidValidate(idInvalid1)).toBe(false);
  expect(uidValidate(idInvalid2)).toBe(false);
  expect(uidValidate(idInvalid3)).toBe(false);
});

test('should generate a unique identifier list', () => {
  const idList = uidList();

  expect(Array.isArray(idList)).toBe(true);
  expect(idList).toHaveLength(0);

  idList.push(uid('identifier'));

  expect(idList).toHaveLength(1);
  expect(typeof idList[0]).toBe('string');
});

test('should validate an identifier list', () => {
  const idListValid = uidList([
    uid('identifier'),
    uid('identifier'),
    uid('identifier'),
    uid('identifier'),
  ]);

  const idListInvalid = uidList([
    uid('identifier'),
    uid('identifier'),
    'invalid:identity' as UID,
    uid('identifier'),
  ]);

  expect(uidListValidate(idListValid)).toBe(true);
  expect(uidListValidate(idListInvalid)).toBe(false);
});

test('should generate a unique identifier tree', () => {
  const idTree = uidTree();

  expect(Array.isArray(idTree)).toBe(true);
  expect(idTree).toHaveLength(0);

  const idRoot1 = uid('identifier');
  const idRoot2 = uid('identifier');
  const idChild1 = uid('identifier');
  const idChild2 = uid('identifier');
  const idChild3 = uid('identifier');

  idTree.push([idRoot1, null]);
  idTree.push([idRoot2, null]);
  idTree.push([idChild1, idRoot1]);
  idTree.push([idChild2, idRoot2]);
  idTree.push([idChild3, idRoot1]);

  expect(idTree).toHaveLength(5);
});

test('should validate an identifier tree', () => {
  const idRoot1 = uid('identifier');
  const idRoot2 = uid('identifier');
  const idChild1 = uid('identifier');
  const idChild2 = uid('identifier');
  const idChild3 = uid('identifier');

  const idTreeValid = uidTree([
    [idRoot1, null],
    [idRoot2, null],
    [idChild1, idRoot1],
    [idChild2, idRoot2],
    [idChild3, idRoot1],
  ]);

  const idTreeInvalid1 = uidTree([
    [idRoot1, null],
    [idRoot2, null],
    [idChild1, uid('identifier')],
    [idChild2, idRoot2],
    [idChild3, idRoot1],
  ]);

  const idTreeInvalid2 = uidTree([
    [idRoot1, null],
    [idRoot2, null],
    ['invalid:identifier' as UID, null],
    [idChild1, idRoot1],
    [idChild2, idRoot2],
    [idChild3, idRoot1],
  ]);

  expect(uidTreeValidate(idTreeValid)).toBe(true);
  expect(uidTreeValidate(idTreeInvalid1)).toBe(false);
  expect(uidTreeValidate(idTreeInvalid2)).toBe(false);
});
