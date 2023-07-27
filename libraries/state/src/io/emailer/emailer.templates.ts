import type { EmailerTemplates } from './emailer.types.js';

const emailerTemplateOtp: EmailerTemplates['otp'] = ({ otp }) => `\
Your one-time passcode is ${otp.val}.

This code will expire in ${Math.ceil((new Date(otp.exp).getTime() - new Date().getTime()) / 1000 / 60)} minutes.\
`;

export const emailerTemplates: EmailerTemplates = {
  otp: emailerTemplateOtp,
};

export default emailerTemplates;
/**
 * Sets a new template or overrites one.
 */
// export const setSendTemplate = (key: string, template: SendTemplate) => {
//   sendTemplates[key] = template;
// };
