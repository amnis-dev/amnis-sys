/* eslint-disable no-bitwise */
export interface ISize {
  width: number | undefined
  height: number | undefined
  orientation?: number
  type?: string
}

export interface ISizeCalculationResult extends ISize {
  images?: ISize[]
}

export interface IImage {
  validate: (buffer: Buffer) => boolean
  calculate: (buffer: Buffer, filepath?: string) => ISizeCalculationResult
}

function calculateExtended(buffer: Buffer): ISize {
  return {
    height: 1 + buffer.readUIntLE(7, 3),
    width: 1 + buffer.readUIntLE(4, 3),
  };
}

function calculateLossless(buffer: Buffer): ISize {
  return {
    height: 1 + (((buffer[4] & 0xF) << 10) | (buffer[3] << 2) | ((buffer[2] & 0xC0) >> 6)),
    width: 1 + (((buffer[2] & 0x3F) << 8) | buffer[1]),
  };
}

function calculateLossy(buffer: Buffer): ISize {
  return {
    height: buffer.readInt16LE(8) & 0x3fff,
    width: buffer.readInt16LE(6) & 0x3fff,
  };
}

export const Webp: IImage = {
  validate(buffer) {
    const riffHeader = buffer.toString('ascii', 0, 4) === 'RIFF';
    const webpHeader = buffer.toString('ascii', 8, 12) === 'WEBP';
    const vp8Header = buffer.toString('ascii', 12, 15) === 'VP8';
    return (riffHeader && webpHeader && vp8Header);
  },

  calculate(buffer) {
    const chunkHeader = buffer.toString('ascii', 12, 16);
    const bufferNext = buffer.slice(20, 30);

    // Extended webp stream signature
    if (chunkHeader === 'VP8X') {
      const extendedHeader = bufferNext[0];
      const validStart = (extendedHeader & 0xc0) === 0;
      const validEnd = (extendedHeader & 0x01) === 0;
      if (validStart && validEnd) {
        return calculateExtended(bufferNext);
      }
      throw new TypeError('Invalid WebP');
    }

    // Lossless webp stream signature
    if (chunkHeader === 'VP8 ' && bufferNext[0] !== 0x2f) {
      return calculateLossy(bufferNext);
    }

    // Lossy webp stream signature
    const signature = bufferNext.toString('hex', 3, 6);
    if (chunkHeader === 'VP8L' && signature !== '9d012a') {
      return calculateLossless(bufferNext);
    }

    throw new TypeError('Invalid WebP');
  },
};
