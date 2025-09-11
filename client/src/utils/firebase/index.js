/**
 * Centralized Firebase Utilities Exports
 * All Firebase-related functions are exported from this single location
 */

// Firebase image utilities
export {
  uploadImageToFirebase,
  safeDeleteImageFromFirebase,
  deleteImageFromFirebase,
} from './firebaseImage';

// Firebase video utilities
export {
  uploadVideoToFirebase,
  safeDeleteVideoFromFirebase,
  deleteVideoFromFirebase,
} from './firebaseVideo';
