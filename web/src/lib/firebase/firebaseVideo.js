import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from './config';

/**
 * Uploads a video file to Firebase Storage and returns the download URL.
 * @param {File} file - The video file to upload.
 * @param {Object} options - Optional: fileName (override), tenantId (required).
 * @returns {Promise<string>} - Resolves to the download URL.
 */
export function uploadVideoToFirebase(file, { fileName, tenantId } = {}) {
  if (!tenantId) {
    throw new Error('tenantId is required for file uploads');
  }

  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const name = fileName
      ? `${tenantId}/videos/${fileName}`
      : `${tenantId}/videos/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: file?.type || 'video/mp4',
    });

    uploadTask.on(
      'state_changed',
      null, // No progress tracking needed
      error => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Uploads a new video and replaces an existing one (deletes old video first).
 * @param {File} file - The new video file to upload.
 * @param {string} oldVideoUrl - The URL of the old video to delete.
 * @param {Object} options - Optional: fileName (override), tenantId (required).
 * @returns {Promise<string>} - Resolves to the new download URL.
 */
export async function uploadVideoAndReplace(
  file,
  oldVideoUrl,
  { fileName, tenantId } = {}
) {
  // Delete old video first
  if (oldVideoUrl) {
    try {
      await deleteVideoFromFirebase(oldVideoUrl);
    } catch (error) {
      console.warn('Failed to delete old video:', error);
      // Continue with upload even if old video deletion fails
    }
  }

  // Upload new video
  return await uploadVideoToFirebase(file, { fileName, tenantId });
}

/**
 * Extracts the storage path from a Firebase video download URL.
 * @param {string} url - The Firebase video download URL.
 * @returns {string} - The storage path or filename.
 */
export function extractStoragePathFromVideoUrl(url) {
  if (!url) return '';

  const match = url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url.split('/').pop().split('?')[0];
}

/**
 * Deletes a video from Firebase Storage by URL or storage name.
 * @param {string} videoUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<void>}
 */
export function deleteVideoFromFirebase(videoUrlOrName) {
  try {
    // Return early if videoUrlOrName is not a valid string
    if (!videoUrlOrName || typeof videoUrlOrName !== 'string') {
      return Promise.resolve();
    }

    const storage = getStorage(app);
    let videoRef;
    if (videoUrlOrName.startsWith('http')) {
      const match = videoUrlOrName.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        videoRef = ref(storage, filePath);
      } else {
        const fallback = videoUrlOrName.split('/').pop().split('?')[0];
        videoRef = ref(storage, fallback);
      }
    } else {
      videoRef = ref(storage, videoUrlOrName);
    }

    return deleteObject(videoRef);
  } catch (error) {
    return Promise.resolve(); // Return resolved promise to prevent unhandled rejections
  }
}
