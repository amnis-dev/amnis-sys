import {
  websiteSlice,
  webComponentSlice,
  webInstanceSlice,
} from './entity/index.js';

export const reducers = {
  [websiteSlice.name]: websiteSlice.reducer,
  [webComponentSlice.name]: webComponentSlice.reducer,
  [webInstanceSlice.name]: webInstanceSlice.reducer,
};

export default reducers;
