/**
 * Encodes a base 16 hash value
 */
export const hashEncode = (data: Uint8Array) => {
  const hashArray = Array.from(data);
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export default { hashEncode };
