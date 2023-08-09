import {
  apiSlice,
  appSlice,
  auditSlice,
  bearerSlice,
  bulletinSlice,
  challengeSlice,
  contactSlice,
  credentialSlice,
  handleSlice,
  historySlice,
  keySlice,
  localeSlice,
  logSlice,
  otpSlice,
  profileSlice,
  roleSlice,
  routeSlice,
  serviceSlice,
  sessionSlice,
  systemSlice,
  userSlice,
  noteSlice,
} from './data/index.js';

export const stateSlices = {
  [apiSlice.name]: apiSlice,
  [appSlice.name]: appSlice,
  [auditSlice.name]: auditSlice,
  [bearerSlice.name]: bearerSlice,
  [bulletinSlice.name]: bulletinSlice,
  [challengeSlice.name]: challengeSlice,
  [contactSlice.name]: contactSlice,
  [credentialSlice.name]: credentialSlice,
  [handleSlice.name]: handleSlice,
  [keySlice.name]: keySlice,
  [historySlice.name]: historySlice,
  [localeSlice.name]: localeSlice,
  [logSlice.name]: logSlice,
  [noteSlice.name]: noteSlice,
  [otpSlice.name]: otpSlice,
  [profileSlice.name]: profileSlice,
  [roleSlice.name]: roleSlice,
  [routeSlice.name]: routeSlice,
  [serviceSlice.name]: serviceSlice,
  [sessionSlice.name]: sessionSlice,
  [systemSlice.name]: systemSlice,
  [userSlice.name]: userSlice,
};

export default stateSlices;
