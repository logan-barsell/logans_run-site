import { handleServiceError } from '../utils/errorHandler';

// Authentication
export const checkAuth = async () => {
  try {
    const response = await fetch('/api/me', {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Authentication check failed'
    );
    throw new Error(message);
  }
};

export const login = async credentials => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Login failed. Please check your credentials.'
    );
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Logout failed');
    throw new Error(message);
  }
};

export const sendPasswordResetEmail = async email => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Password reset request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to send password reset email. Please try again.'
    );
    throw new Error(message);
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Password reset failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to reset password. Please try again.'
    );
    throw new Error(message);
  }
};
