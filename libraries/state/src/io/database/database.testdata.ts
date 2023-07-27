import type { Entity, EntityObjects } from '../../data/entity/index.js';
import { entityCreate } from '../../data/entity/index.js';
import { uid } from '../../core/index.js';
import type { Data } from '../../data/data.types.js';

export interface TestDataTodo extends Data {
  title: string;
  priority: number;
  remind: boolean;
}

/**
 * Test subject that is owner or creator of some of the data.
 */
export const testDataSubject = entityCreate({ $id: uid('subject') });

/**
 * Test data todo.
 */
export const testDataTodoKey = 'todo';
export const testDataTodos: Entity<TestDataTodo>[] = [
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Hit the Gym',
    priority: 2,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Meet Sophie',
    priority: 4,
    remind: true,
  }, { $owner: testDataSubject.$id, $creator: testDataSubject.$id }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Meet Finn',
    priority: 4,
    remind: true,
  }, { $owner: testDataSubject.$id, $creator: testDataSubject.$id }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Buy eggs',
    priority: 3,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Read a book',
    priority: 3,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Organize Office',
    priority: 1,
    remind: true,
  }, { $owner: testDataSubject.$id, $creator: testDataSubject.$id }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Walk the dog',
    priority: 4,
    remind: true,
  }, { $owner: testDataSubject.$id, $creator: testDataSubject.$id }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Make healthy breakfast',
    priority: 2,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Go to the bank',
    priority: 0,
    remind: true,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Go to chemistry class',
    priority: 1,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Hike up the Alps',
    priority: 3,
    remind: false,
  }),
  entityCreate({
    $id: uid(testDataTodoKey),
    title: 'Clean the kitchen',
    priority: 3,
    remind: true,
  }),
];

/**
 * List of prioritized items to expect.
 */
export const testDataTodoPriorities: TestDataTodo[][] = [
  testDataTodos.filter((t) => t.priority === 0),
  testDataTodos.filter((t) => t.priority === 1),
  testDataTodos.filter((t) => t.priority === 2),
  testDataTodos.filter((t) => t.priority === 3),
  testDataTodos.filter((t) => t.priority === 4),
];

/**
 * List of items with remind as false or true.
 */
export const testDataTodoRemind = {
  false: testDataTodos.filter((t) => t.remind === false),
  true: testDataTodos.filter((t) => t.remind === true),
};

/**
 * List of items owned by the subject.
 */
export const testDataOwned = testDataTodos.filter((t) => t.$owner === testDataSubject.$id);

/**
 * Mocked data for database testing.
 */
export const testData: EntityObjects = {
  [testDataTodoKey]: testDataTodos,
};

export default testData;
