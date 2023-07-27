import { fileCreate } from '../file/file.js';
import { uid } from '../../../core/index.js';
import type { Video, VideoRoot, VideoMinimal } from './video.types.js';

export const videoKey = 'video';

export const videoRoot: VideoRoot = {
  extension: 'webm',
  mimetype: 'video/webm',
  width: 0,
  height: 0,
  aspect: 0,
  duration: 0,
  title: 'Untitled Video',
  slug: 'untitled-video',
  size: 0,
};

export function videoCreate(
  video: VideoMinimal,
): Video {
  return {
    ...videoRoot,
    ...fileCreate(video),
    aspect: video.aspect ?? (video.width / video.height),
    $id: uid(videoKey),
  };
}
