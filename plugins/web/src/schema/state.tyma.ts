import type { DataUpdate } from '@amnis/state';
import type { Website } from '@amnis/web/set';

export interface DataCreator {
  website?: Website[];
}

export interface DataUpdater {
  website?: DataUpdate<Website>[];
}
