import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from './config';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {Object} options - Optional: fileName (override), tenantId (required).
 * @returns {Promise<string>} - Resolves to the download URL.
 */
export function uploadImageToFirebase(file, { fileName, tenantId } = {}) {
  if (!tenantId) {
    throw new Error('tenantId is required for file uploads');
  }

  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const name = fileName
      ? `${tenantId}/images/${fileName}`
      : `${tenantId}/images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

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
 * Uploads a new image and replaces an existing one (deletes old image first).
 * @param {File} file - The new file to upload.
 * @param {string} oldImageUrl - The URL of the old image to delete.
 * @param {Object} options - Optional: fileName (override), tenantId (required).
 * @returns {Promise<string>} - Resolves to the new download URL.
 */
export async function uploadImageAndReplace(
  file,
  oldImageUrl,
  { fileName, tenantId } = {}
) {
  // Delete old image first
  if (oldImageUrl) {
    try {
      await deleteImageFromFirebase(oldImageUrl);
    } catch (error) {
      console.warn('Failed to delete old image:', error);
      // Continue with upload even if old image deletion fails
    }
  }

  // Upload new image
  return await uploadImageToFirebase(file, { fileName, tenantId });
}

/**
 * Uploads multiple images in parallel and returns results.
 * @param {FileList|Array} files - The files to upload.
 * @param {Object} options - Optional: fileName (prefix for naming), tenantId (required).
 * @returns {Promise<Array>} - Array of upload results with success/error status.
 */
export async function uploadImagesBulk(files, { fileName, tenantId } = {}) {
  if (!tenantId) {
    throw new Error('tenantId is required for bulk file uploads');
  }

  const uploadPromises = Array.from(files).map(async (file, index) => {
    const fileFileName = fileName || `${Date.now()}_${index}_${file.name}`;
    try {
      const downloadURL = await uploadImageToFirebase(file, {
        fileName: fileFileName,
        tenantId,
      });
      return { name: fileFileName, imgLink: downloadURL, success: true };
    } catch (error) {
      return { name: fileFileName, error: error.message, success: false };
    }
  });

  return await Promise.all(uploadPromises);
}

/**
 * Extracts the storage path from a Firebase download URL.
 * @param {string} url - The Firebase download URL.
 * @returns {string} - The storage path or filename.
 */
export function extractStoragePathFromUrl(url) {
  if (!url) return '';

  const match = url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url.split('/').pop().split('?')[0];
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
