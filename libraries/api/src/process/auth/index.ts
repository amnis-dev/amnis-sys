import type { IoProcessDefinition } from '@amnis/state';
import { processAuthAuthenticate } from './auth.authenticate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthCreate } from './auth.create.js';
import { processAuthCredential } from './auth.credential.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';
import { processAuthOtp } from './auth.otp.js';
import { processAuthRegister } from './auth.register.js';
import { processAuthVerify } from './auth.verify.js';

export const auth: IoProcessDefinition = {
  meta: {
    reducerPath: 'apiAuth',
    auth: true,
    signature: ['authenticate', 'login', 'register', 'credential', 'create'],
    challenge: ['authenticate', 'login', 'register', 'credential', 'create'],
    otp: ['credential'],
  },
  endpoints: {
    post: {
      authenticate: processAuthAuthenticate,
      challenge: processAuthChallenge,
      create: processAuthCreate,
      credential: processAuthCredential,
      otp: processAuthOtp,
      register: processAuthRegister,
      login: processAuthLogin,
      logout: processAuthLogout,
      verify: processAuthVerify,
    },
  },
};

export default auth;
