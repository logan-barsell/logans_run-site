// Server-side authentication utilities for middleware

export async function checkAuthStatus(request) {
  try {
    const url = new URL(request.url);
    const baseUrl =
      process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      console.warn('API_BASE_URL not configured');
      return { authenticated: false };
    }

    // Get tenant ID from headers (injected by middleware)
    const tenantId = request.headers.get('x-tenant-id');

    // Create headers for the auth check request
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    // Forward cookies from the original request
    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers.set('cookie', cookie);
    }

    // Add tenant ID if available
    if (tenantId) {
      headers.set('x-tenant-id', tenantId);
    }

    // Make request to auth endpoint
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (response.ok) {
      const responseText = await response.text();

      if (!responseText || responseText.trim() === '') {
        return { authenticated: false };
      }

      try {
        const responseData = JSON.parse(responseText);
        return {
          authenticated: true,
          user: responseData.data, // Extract the actual user data from the nested structure
        };
      } catch (parseError) {
        console.error('❌ Failed to parse auth response:', parseError);
        return { authenticated: false };
      }
    } else {
      return { authenticated: false };
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
}

export function isAdminRoute(pathname) {
  // Check if the route is an admin route
  return pathname.startsWith('/settings') || pathname.startsWith('/admin');
}

export function isAuthRoute(pathname) {
  // Check if the route is an authentication route
  return (
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/2fa-verification')
  );
}
