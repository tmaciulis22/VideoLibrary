import { CHUNK_SIZE, FILENAME_WITHOUT_EXTENSION_REGEX } from "../constants";

const getChunkCount = (video) => (
  video.size % CHUNK_SIZE === 0
      ? video.size / CHUNK_SIZE
      : Math.floor(video.size / CHUNK_SIZE) + 1
);

const getFileNameWithoutExtension = (fileName) => (
  fileName.match(FILENAME_WITHOUT_EXTENSION_REGEX)[1]
)

export { getChunkCount,getFileNameWithoutExtension };
