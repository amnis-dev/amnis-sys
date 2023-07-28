/**
 * Gets a JWT bearer from an authorization header
 */
export function httpAuthorizationParse(authorization?: string | null): string | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, accessEncoded] = authorization.split(' ');

  if (type !== 'Bearer' || !accessEncoded) {
    return undefined;
  }

  return accessEncoded as string;
}

export default { httpAuthorizationParse };
