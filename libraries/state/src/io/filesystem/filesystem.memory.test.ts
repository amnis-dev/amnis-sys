import stream from 'node:stream';
import ffmpeg from 'fluent-ffmpeg';
import { filesystemMemory } from './filesystem.memory.js';
import type { UID } from '../../core/index.js';
import { uid } from '../../core/index.js';
import type { Image } from '../../data/index.js';

function imageLoad(path: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const writeStream = new stream.PassThrough();

    ffmpeg();

    try {
      ffmpeg(path)
        .addOutputOptions(['-quality 1', '-vf scale=64:-1'])
        .format('webp')
        .writeToStream(writeStream);
    } catch (e) {
      reject(e);
    }

    const buffers: Uint8Array[] = [];
    writeStream.on('data', (b) => {
      buffers.push(b);
    });
    writeStream.on('end', () => {
      const bufferOut = Buffer.concat(buffers);
      resolve(new Uint8Array(bufferOut));
    });
  });
}

let imageId: UID<Image> = uid('image');

/**
 * ============================================================
 */
test('file system should save file.', async () => {
  const imageBuffer = await imageLoad('./_static/iga.png');

  const image = await filesystemMemory.imageWrite(imageBuffer.buffer, { title: 'IGA Logo' });
  if (image) {
    imageId = image?.$id;
  }

  expect(image).toMatchObject({
    title: 'IGA Logo',
    slug: 'iga-logo',
    mimetype: 'image/webp',
    width: 64,
    height: 64,
    size: expect.any(Number),
  });
});

/**
 * ============================================================
 */
test('file system should read saved image file.', async () => {
  const image = await filesystemMemory.imageRead(imageId);

  if (!image) {
    expect(image).toBeDefined();
    return;
  }

  expect(Buffer.byteLength(image)).toBeGreaterThan(128);
});
