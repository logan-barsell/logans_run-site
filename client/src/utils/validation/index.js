/**
 * Centralized Validation Exports
 * All validation functions are exported from this single location
 */

// Form validation
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

// Music URL validation
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

// Password validation
export {
  validatePassword,
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from './passwordValidation';
