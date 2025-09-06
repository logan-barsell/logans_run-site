const admin = require('firebase-admin');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('../config/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com',
  });
}

const bucket = admin.storage().bucket();

/**
 * Uploads a video file to Firebase Storage and returns the download URL.
 * @param {Buffer} fileBuffer - The video file buffer.
 * @param {string} fileName - The name for the file in storage.
 * @param {Object} options - Optional callbacks: onProgress(progress).
 * @returns {Promise<string>} - Resolves to the download URL.
 */
async function uploadVideoToFirebase(
  fileBuffer,
  fileName,
  { onProgress } = {}
) {
  try {
    const file = bucket.file(`videos/${fileName}`);

    const uploadOptions = {
      metadata: {
        contentType: 'video/mp4', // Default to mp4, could be made dynamic
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
      resumable: true,
    };

    // Create a write stream
    const stream = file.createWriteStream(uploadOptions);

    return new Promise((resolve, reject) => {
      stream.on('error', error => {
        logger.error('❌ Video upload stream error:', error);
        reject(new AppError('Failed to upload video file', 500));
      });

      stream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await file.makePublic();

          // Get the download URL
          const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

          logger.info(`✅ Video uploaded successfully: ${fileName}`);
          resolve(downloadURL);
        } catch (error) {
          logger.error('❌ Error making video public or getting URL:', error);
          reject(new AppError('Failed to finalize video upload', 500));
        }
      });

      // Write the file buffer to the stream
      stream.end(fileBuffer);

      // Call onProgress with 100 when complete (for spinner)
      if (onProgress) {
        onProgress(100);
      }
    });
  } catch (error) {
    logger.error('❌ Error uploading video to Firebase:', error);
    throw new AppError(
      error.message || 'Failed to upload video',
      error.statusCode || 500
    );
  }
}

/**
 * Generates a thumbnail from a video file and uploads it to Firebase Storage.
 * @param {Buffer} videoBuffer - The video file buffer.
 * @param {string} videoFileName - The original video file name.
 * @returns {Promise<string>} - Resolves to the thumbnail download URL.
 */
async function generateVideoThumbnail(videoBuffer, videoFileName) {
  try {
    // For now, we'll create a placeholder thumbnail
    // In a production environment, you might want to use ffmpeg or similar
    // to extract an actual frame from the video

    const thumbnailFileName = `thumbnails/${videoFileName.replace(
      /\.[^/.]+$/,
      ''
    )}_thumb.jpg`;

    // Create a simple placeholder thumbnail (1x1 pixel transparent image)
    const placeholderThumbnail = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    const file = bucket.file(thumbnailFileName);

    await file.save(placeholderThumbnail, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      },
    });

    await file.makePublic();
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    logger.info(`✅ Video thumbnail generated: ${thumbnailFileName}`);
    return downloadURL;
  } catch (error) {
    logger.error('❌ Error generating video thumbnail:', error);
    // Don't throw error for thumbnail generation failure
    return null;
  }
}

/**
 * Deletes a video file from Firebase Storage by URL or storage name.
 * @param {string} videoUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<void>}
 */
async function deleteVideoFromFirebase(videoUrlOrName) {
  try {
    if (!videoUrlOrName || typeof videoUrlOrName !== 'string') {
      return Promise.resolve();
    }

    let fileName;
    if (videoUrlOrName.startsWith('http')) {
      // Extract file name from URL
      const match = videoUrlOrName.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      } else {
        // Fallback: extract from URL path
        const urlParts = videoUrlOrName.split('/');
        fileName = urlParts[urlParts.length - 1].split('?')[0];
      }
    } else {
      fileName = videoUrlOrName;
    }

    const file = bucket.file(fileName);
    await file.delete();

    logger.info(`✅ Video deleted from Firebase: ${fileName}`);
  } catch (error) {
    logger.error('❌ Error deleting video from Firebase:', error);
    throw new AppError(
      error.message || 'Failed to delete video',
      error.statusCode || 500
    );
  }
}

/**
 * Safely deletes a video from Firebase Storage without failing the main operation.
 * @param {string} videoUrlOrName - The full download URL or just the storage name.
 * @returns {Promise<boolean>} - Returns true if deletion was successful, false if it failed.
 */
async function safeDeleteVideoFromFirebase(videoUrlOrName) {
  try {
    await deleteVideoFromFirebase(videoUrlOrName);
    return true;
  } catch (error) {
    logger.warn('Failed to delete video from Firebase:', error);
    return false;
  }
}

/**
 * Deletes both video file and thumbnail from Firebase Storage.
 * @param {string} videoUrl - The video file URL.
 * @param {string} thumbnailUrl - The thumbnail file URL.
 * @returns {Promise<boolean>} - Returns true if both deletions were successful.
 */
async function deleteVideoAndThumbnailFromFirebase(videoUrl, thumbnailUrl) {
  try {
    const videoDeleted = await safeDeleteVideoFromFirebase(videoUrl);
    const thumbnailDeleted = thumbnailUrl
      ? await safeDeleteVideoFromFirebase(thumbnailUrl)
      : true;

    return videoDeleted && thumbnailDeleted;
  } catch (error) {
    logger.error('❌ Error deleting video and thumbnail:', error);
    return false;
  }
}

module.exports = {
  uploadVideoToFirebase,
  generateVideoThumbnail,
  deleteVideoFromFirebase,
  safeDeleteVideoFromFirebase,
  deleteVideoAndThumbnailFromFirebase,
};
