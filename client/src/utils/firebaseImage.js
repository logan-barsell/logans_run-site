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

    let progressInterval;
    let simulatedProgress = 0;

    // Start simulated progress immediately
    if (onProgress) {
      onProgress(0);

      // Simulate progress for fast uploads
      progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          simulatedProgress += Math.random() * 15 + 5; // Random increment between 5-20%
          onProgress(Math.floor(simulatedProgress));
        }
      }, 100);
    }

    uploadTask.on(
      'state_changed',
      snapshot => {
        if (onProgress) {
          const actualProgress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // If we get real progress updates, use them
          if (actualProgress > simulatedProgress) {
            simulatedProgress = actualProgress;
            onProgress(actualProgress);
          }
        }
      },
      error => {
        if (progressInterval) clearInterval(progressInterval);
        reject(error);
      },
      async () => {
        if (progressInterval) clearInterval(progressInterval);
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
 * Deletes an image from Firebase Storage by URL or storage name.
 * @param {string} imageUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<void>}
 */
export function deleteImageFromFirebase(imageUrlOrName) {
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
}
