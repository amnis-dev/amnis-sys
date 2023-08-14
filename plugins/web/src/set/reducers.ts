import {
  websiteSlice,
} from './entity/index.js';

export const reducers = {
  [websiteSlice.name]: websiteSlice.reducer,
};

export default reducers;
