import {
  websiteSlice,
  webComponentSlice,
  webInstanceSlice,
} from './entity/index.js';

export const slices = {
  [websiteSlice.name]: websiteSlice,
  [webComponentSlice.name]: webComponentSlice,
  [webInstanceSlice.name]: webInstanceSlice,
};

export default slices;
