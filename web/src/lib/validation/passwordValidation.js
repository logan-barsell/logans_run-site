/**
 * Password validation utility with strong security requirements
 */

export const validatePassword = password => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Maximum length (prevent DoS attacks)
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*...)'
    );
  }

  // Check for common weak patterns (only if password is mostly the weak pattern)
  const weakPatterns = [
    'password',
    '123456',
    'qwerty',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'football',
  ];

  const lowerPassword = password.toLowerCase();
  // Only flag if the password is mostly a weak pattern (more than 70% of the password)
  if (
    weakPatterns.some(pattern => {
      const patternLength = pattern.length;
      const passwordLength = password.length;
      return (
        lowerPassword.includes(pattern) && patternLength / passwordLength > 0.7
      );
    })
  ) {
    errors.push('Password contains common weak patterns');
  }

  // Check for repeated characters (more than 3 in a row)
  if (/(.)\1{3,}/.test(password)) {
    errors.push(
      'Password cannot contain more than 3 repeated characters in a row'
    );
  }

  // Check for sequential characters (like 123, abc)
  if (
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
      password
    )
  ) {
    errors.push(
      'Password cannot contain sequential characters (like 123, abc)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};

export const calculatePasswordStrength = password => {
  if (!password) return 0;

  let score = 0;

  // Length contribution
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety contribution
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

  // Bonus for mixed case and numbers
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score += 1;

  // Penalty for weak patterns
  const weakPatterns = ['password', '123456', 'qwerty', 'admin'];
  if (weakPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score = Math.max(0, score - 2);
  }

  // Return strength level
  if (score >= 7) return 'strong';
  if (score >= 5) return 'medium';
  if (score >= 3) return 'weak';
  return 'very-weak';
};

export const getPasswordStrengthColor = strength => {
  switch (strength) {
    case 'strong':
      return 'success';
    case 'medium':
      return 'warning';
    case 'weak':
      return 'danger';
    case 'very-weak':
      return 'danger';
    default:
      return 'secondary';
  }
};

export const getPasswordStrengthText = strength => {
  switch (strength) {
    case 'strong':
      return 'Strong password';
    case 'medium':
      return 'Medium strength password';
    case 'weak':
      return 'Weak password';
    case 'very-weak':
      return 'Very weak password';
    default:
      return 'Enter a password';
  }
};

/**
 * Legacy password strength validation (simpler version)
 * @param {string} password - Password to validate
 * @returns {object} Validation result with score, feedback, and validity
 */
export const validatePasswordStrength = password => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = {
    score: 0,
    feedback: [],
    isValid: false,
  };

  if (password.length >= minLength) {
    strength.score += 1;
  } else {
    strength.feedback.push(`At least ${minLength} characters`);
  }

  if (hasUpperCase) {
    strength.score += 1;
  } else {
    strength.feedback.push('One uppercase letter');
  }

  if (hasLowerCase) {
    strength.score += 1;
  } else {
    strength.feedback.push('One lowercase letter');
  }

  if (hasNumbers) {
    strength.score += 1;
  } else {
    strength.feedback.push('One number');
  }

  if (hasSpecialChar) {
    strength.score += 1;
  } else {
    strength.feedback.push('One special character');
  }

  strength.isValid = strength.score >= 4 && password.length >= minLength;

  return strength;
};

/**
 * Get password strength label and color (legacy version)
 * @param {number} score - Password strength score (0-5)
 * @returns {object} Label and color for the score
 */
export const getPasswordStrengthLabel = score => {
  if (score < 2) return { label: 'Weak', color: '#dc3545' };
  if (score < 4) return { label: 'Fair', color: '#ffc107' };
  if (score < 5) return { label: 'Good', color: '#17a2b8' };
  return { label: 'Strong', color: '#28a745' };
};
