import { handleServiceError } from '../utils/errorHandler';

// Authentication
export const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/me', {
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Login failed');
    throw new Error(message);
  }
};

export const signup = async userData => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Signup failed');
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Logout failed');
    throw new Error(message);
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Token refresh failed');
    throw new Error(message);
  }
};

export const requestPasswordReset = async email => {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset request failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Password reset request failed'
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Password reset failed');
    throw new Error(message);
  }
};

export const verifyEmail = async token => {
  try {
    const response = await fetch(`/api/auth/verify-email?token=${token}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Email verification failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Email verification failed');
    throw new Error(message);
  }
};

export const resendEmailVerification = async email => {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Failed to resend verification email'
      );
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to resend verification email'
    );
    throw new Error(message);
  }
};

// Legacy endpoints for backward compatibility
export const legacyCheckAuth = async () => {
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

export const legacyLogin = async credentials => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Login failed');
    throw new Error(message);
  }
};

export const legacyLogout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  } catch (error) {
    const { message } = handleServiceError(error, 'Logout failed');
    throw new Error(message);
  }
};
