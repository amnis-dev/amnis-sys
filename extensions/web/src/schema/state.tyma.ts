import type { DataUpdate } from '@amnis/state';
import type { Website } from '../set/entity/website/website.types.js';

export interface DataCreator {
  website?: Website[];
}

export interface DataUpdater {
  website?: DataUpdate<Website>[];
}
