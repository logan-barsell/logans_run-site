import api from './api';

class SecurityService {
  /**
   * Change user password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  /**
   * Get user sessions
   */
  async getSessions(page = 1, limit = 10) {
    const response = await api.get(
      `/user/sessions?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * End a specific session
   */
  async endSession(sessionId) {
    const response = await api.delete(`/user/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * End all other sessions (keep current one)
   */
  async endAllOtherSessions() {
    const response = await api.delete('/user/sessions');
    return response.data;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
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
  }

  /**
   * Get password strength label
   */
  getPasswordStrengthLabel(score) {
    if (score < 2) return { label: 'Weak', color: '#dc3545' };
    if (score < 4) return { label: 'Fair', color: '#ffc107' };
    if (score < 5) return { label: 'Good', color: '#17a2b8' };
    return { label: 'Strong', color: '#28a745' };
  }
}

export default new SecurityService();
