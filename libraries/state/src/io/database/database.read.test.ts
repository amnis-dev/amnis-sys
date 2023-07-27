import type { Entity } from '../../data/index.js';
import { dataOrder } from '../../data/index.js';
import { databaseMemory, databaseMemoryStorage } from './database.memory.js';
import type { TestDataTodo } from './database.testdata.js';
import {
  testData, testDataTodoKey, testDataTodoPriorities,
} from './database.testdata.js';

beforeAll(() => {
  const storage = databaseMemoryStorage();
  Object.keys(testData).forEach((key) => {
    storage[key] = testData[key].reduce<Record<string, Entity>>((acc, cur) => {
      acc[cur.$id] = cur;
      return acc;
    }, {});
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read all todos with empty query', async () => {
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {},
    },
  });

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(testData[testDataTodoKey].length);
  expect(todos[testDataTodoKey]).toEqual(
    dataOrder(testData[testDataTodoKey]),
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read all todos with limited results', async () => {
  const limit = 5;
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {},
      $range: {
        limit,
      },
    },
  });

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(limit);
  expect(todos[testDataTodoKey]).toEqual(
    dataOrder(testData[testDataTodoKey]).slice(0, limit),
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read all todos with limited results and a starting point', async () => {
  const start = 2;
  const limit = 5;
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {},
      $range: {
        start,
        limit,
      },
    },
  });

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(limit);
  expect(todos[testDataTodoKey]).toEqual(
    dataOrder(testData[testDataTodoKey]).slice(start, limit + start),
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos even when starting point is out of bounds', async () => {
  const start = 24;
  const limit = 5;
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {},
      $range: {
        start,
        limit,
      },
    },
  });

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(0);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos with their respective priorities', async () => {
  await Promise.all([...Array(4)].map(async (_, i) => {
    const todos = await databaseMemory.read({
      [testDataTodoKey]: {
        $query: {
          priority: {
            $eq: i,
          },
        },
      },
    });

    expect(Object.keys(todos)).toHaveLength(1);
    expect(todos[testDataTodoKey]).toHaveLength(testDataTodoPriorities[i].length);
    expect(todos[testDataTodoKey]).toEqual(dataOrder(testDataTodoPriorities[i]));
  }));
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos with a priority less than 3', async () => {
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {
        priority: {
          $lt: 3,
        },
      },
    },
  });

  const expectation = (dataOrder(testData[testDataTodoKey]) as Entity<TestDataTodo>[]).filter(
    (t) => t.priority < 3,
  );

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(expectation.length);
  expect(todos[testDataTodoKey]).toEqual(expectation);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos with a priority less than or equal to 3', async () => {
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {
        priority: {
          $lte: 3,
        },
      },
    },
  });

  const expectation = (dataOrder(testData[testDataTodoKey]) as Entity<TestDataTodo>[]).filter(
    (t) => t.priority <= 3,
  );

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(expectation.length);
  expect(todos[testDataTodoKey]).toEqual(expectation);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos with a priority greater than 3', async () => {
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {
        priority: {
          $gt: 3,
        },
      },
    },
  });

  const expectation = (dataOrder(testData[testDataTodoKey]) as Entity<TestDataTodo>[]).filter(
    (t) => t.priority > 3,
  );

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(expectation.length);
  expect(todos[testDataTodoKey]).toEqual(expectation);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should read todos with a priority greater than or equal to 3', async () => {
  const todos = await databaseMemory.read({
    [testDataTodoKey]: {
      $query: {
        priority: {
          $gte: 3,
        },
      },
    },
  });

  const expectation = (dataOrder(testData[testDataTodoKey]) as Entity<TestDataTodo>[]).filter(
    (t) => t.priority >= 3,
  );

  expect(Object.keys(todos)).toHaveLength(1);
  expect(todos[testDataTodoKey]).toHaveLength(expectation.length);
  expect(todos[testDataTodoKey]).toEqual(expectation);
});
