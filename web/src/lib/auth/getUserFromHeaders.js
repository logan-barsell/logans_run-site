// Utility to extract user authentication status from request headers
// This is set by middleware and can be used in server components

export async function getUserFromHeaders(headers) {
  const h = await headers;
  const isAuthenticated = h.get('x-user-authenticated') === 'true';
  const userDataStr = h.get('x-user-data');

  let user = null;
  if (userDataStr) {
    try {
      user = JSON.parse(userDataStr);
    } catch (error) {
      console.warn('Failed to parse user data from headers:', error);
    }
  }

  return {
    isAuthenticated,
    user,
    isAdmin: isAuthenticated && user?.role === 'admin', // Adjust based on your user role structure
  };
}
