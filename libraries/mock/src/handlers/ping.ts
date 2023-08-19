import type { RestHandler } from 'msw';
import { rest } from 'msw';

/**
 * A ping that responds with an OK status.
 */
export const handlerPing: (baseUrl: string) => RestHandler = (baseUrl) => (
  rest.get(
    `${baseUrl}/mock/ping`,
    (req, res, ctx) => res(
      ctx.status(200),
    ),
  )
);

export default handlerPing;
