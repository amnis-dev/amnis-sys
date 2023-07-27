import { imageCreate } from './image.js';

/**
 * ============================================================
 */
test('should create a image', () => {
  const image = imageCreate({
    title: 'Amnis Logo',
    extension: 'webp',
    width: 0,
    height: 0,
    mimetype: 'image/webp',
    size: 0,
  });

  expect(image).toEqual(
    expect.objectContaining({
      title: 'Amnis Logo',
      extension: 'webp',
      width: 0,
      height: 0,
      mimetype: 'image/webp',
      size: 0,
    }),
  );
});
