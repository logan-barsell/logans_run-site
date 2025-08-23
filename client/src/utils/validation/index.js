/**
 * Centralized Validation Exports
 * All validation functions are exported from this single location
 */

// Form validation (email, phone, general URL)
export {
  validateEmail,
  validatePhone,
  normalizePhone,
  validateUrl,
} from './formValidation';

// Social media validation
export {
  validateFacebookUrl,
  validateInstagramUrl,
  validateTikTokUrl,
  validateYouTubeSocialUrl,
  validateXUrl,
} from './socialMediaValidation';

// Music platform validation
export {
  validateAppleMusicUrl,
  validateYouTubeUrl,
  validateSoundCloudUrl,
} from './musicUrlValidation';

// Spotify validation
export {
  validateSpotifyUrl,
  validateSpotifySocialUrl,
} from './spotifyValidation';
