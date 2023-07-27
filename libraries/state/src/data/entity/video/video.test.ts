import { videoKey, videoCreate } from './video.js';

/**
 * ============================================================
 */
test('video key should be is properly set', () => {
  expect(videoKey).toEqual('video');
});

/**
 * ============================================================
 */
test('should create a video', () => {
  const video = videoCreate({
    title: 'Introduction to Amnis State',
    extension: 'webm',
    width: 0,
    height: 0,
    duration: 0,
    mimetype: 'video/webm',
    size: 0,
  });

  expect(video).toEqual(
    expect.objectContaining({
      title: expect.any(String),
    }),
  );
});
