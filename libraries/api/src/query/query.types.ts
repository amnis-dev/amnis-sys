import type { IoOutputJson } from '@amnis/state';

export type ApiError = {
  status: number;
  data: IoOutputJson;
};
