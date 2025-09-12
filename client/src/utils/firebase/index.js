/**
 * Centralized Firebase Utilities Exports
 * All Firebase-related functions are exported from this single location
 */

// Firebase image utilities
export {
  uploadImageToFirebase,
  uploadImageAndReplace,
  uploadImagesBulk,
  deleteImageFromFirebase,
  extractStoragePathFromUrl,
} from './firebaseImage';

// Firebase video utilities
export {
  uploadVideoToFirebase,
  uploadVideoAndReplace,
  deleteVideoFromFirebase,
  extractStoragePathFromVideoUrl,
} from './firebaseVideo';
