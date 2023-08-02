import {
  GrantTask, type Entity,
  type EntityObjects,
  type StateDataPromise,
  historyMake,
  stateEntitiesCreate,
  historySlice
} from "@amnis/state";
import { Website, websiteSlice } from "../set/entity/index.js";

export const data: StateDataPromise = async () => {
  const websites: Entity<Website>[] = [
    websiteSlice.createEntity({
      hostname: 'localhost',
      title: 'Website Title',
      routes: [],
    }),
  ];

  const stateEntitiesInital: EntityObjects = {
    [websiteSlice.key]: websites,
  };

  /**
   * Create this initial history.
   */
  const stateEntities: EntityObjects = {
    ...stateEntitiesInital,
    ...stateEntitiesCreate({
      [historySlice.key]: historyMake(stateEntitiesInital, GrantTask.Create),
    }, { committed: true, new: false }),
  };

  return stateEntities;
};