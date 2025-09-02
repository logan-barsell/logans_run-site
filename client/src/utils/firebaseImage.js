import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from '../pagesAdmin/firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {Object} options - Optional callbacks: onProgress(progress), fileName (override).
 * @returns {Promise<string>} - Resolves to the download URL.
 */
export function uploadImageToFirebase(file, { onProgress, fileName } = {}) {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const name = fileName || Date.now() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Call onProgress with 0 to indicate upload started (for backward compatibility)
    if (onProgress) {
      onProgress(0);
    }

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Progress tracking removed - just call onProgress with 100 when complete
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
 * Safely deletes an image from Firebase Storage without failing the main operation.
 * This is useful for delete/edit operations where image cleanup is secondary to the main operation.
 *
 * @param {string} imageUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<boolean>} - Returns true if deletion was successful, false if it failed.
 */
export async function safeDeleteImageFromFirebase(imageUrlOrName) {
  try {
    await deleteImageFromFirebase(imageUrlOrName);
    return true;
  } catch (error) {
    console.warn('Failed to delete image from Firebase:', error);
    return false;
  }
}

/**
 * Deletes an image from Firebase Storage by URL or storage name.
 * @param {string} imageUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<void>}
 */
export function deleteImageFromFirebase(imageUrlOrName) {
  try {
    // Return early if imageUrlOrName is not a valid string
    if (!imageUrlOrName || typeof imageUrlOrName !== 'string') {
      return Promise.resolve();
    }

    const storage = getStorage(app);
    let imageRef;
    if (imageUrlOrName.startsWith('http')) {
      const match = imageUrlOrName.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        imageRef = ref(storage, filePath);
      } else {
        const fallback = imageUrlOrName.split('/').pop().split('?')[0];
        imageRef = ref(storage, fallback);
      }
    } else {
      imageRef = ref(storage, imageUrlOrName);
    }

    return deleteObject(imageRef);
  } catch (error) {
    return Promise.resolve(); // Return resolved promise to prevent unhandled rejections
  }
}
