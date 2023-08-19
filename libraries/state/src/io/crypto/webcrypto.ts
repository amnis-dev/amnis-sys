let webcryptoInstance: Crypto | undefined;

export const webcrypto = async (): Promise<Crypto> => {
  if (!webcryptoInstance) {
    if (typeof window === 'undefined') {
      const c = await import('node:crypto');
      webcryptoInstance = c.webcrypto as Crypto;
    } else {
      webcryptoInstance = window.crypto as Crypto;
    }
  }

  return webcryptoInstance;
};

export default webcrypto;
