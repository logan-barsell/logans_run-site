import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from '../../pagesAdmin/firebase';

/**
 * Uploads a video file to Firebase Storage and returns the download URL.
 * @param {File} file - The video file to upload.
 * @param {Object} options - Optional callbacks: onProgress(progress), fileName (override).
 * @returns {Promise<string>} - Resolves to the download URL.
 */
export function uploadVideoToFirebase(file, { onProgress, fileName } = {}) {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const name = fileName || `videos/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Call onProgress with 0 to indicate upload started
    if (onProgress) {
      onProgress(0);
    }

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Progress tracking - just call onProgress with 100 when complete
        if (onProgress && snapshot.state === 'success') {
          onProgress(100);
        }
      },
      error => {
        reject(error);
      },
      async () => {
        if (onProgress) onProgress(100);

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
 * Safely deletes a video from Firebase Storage without failing the main operation.
 * @param {string} videoUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<boolean>} - Returns true if deletion was successful, false if it failed.
 */
export async function safeDeleteVideoFromFirebase(videoUrlOrName) {
  try {
    await deleteVideoFromFirebase(videoUrlOrName);
    return true;
  } catch (error) {
    console.warn('Failed to delete video from Firebase:', error);
    return false;
  }
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
