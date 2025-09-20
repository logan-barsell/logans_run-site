import { NextResponse } from 'next/server';
import {
  checkAuthStatus,
  isAdminRoute,
  isAuthRoute,
} from './lib/auth/serverAuth';

// Lightweight host parsing here to keep middleware edge-safe
function resolveTenant(host, devOverride) {
  const normalizedHost = (host || '').toLowerCase();

  if (devOverride) return { id: devOverride };
  if (!normalizedHost) return null;

  const isLocal =
    normalizedHost.includes('localhost') ||
    normalizedHost.includes('127.0.0.1') ||
    normalizedHost.includes('[::1]');
  if (isLocal) return null;

  const hostNoPort = normalizedHost.split(':')[0];
  const parts = hostNoPort.split('.');
  if (parts.length <= 2) return { id: null, slug: 'bandsyte' };
  const [subdomain] = parts;
  if (!subdomain || subdomain === 'www') return { id: null, slug: 'bandsyte' };
  return { id: null, slug: subdomain };
}

export async function middleware(req) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';
  const devOverride =
    url.searchParams.get('tenant') || process.env.DEV_TENANT_ID || '';
  const tenant = resolveTenant(host, devOverride);

  const requestHeaders = new Headers(req.headers);
  if (tenant?.id) requestHeaders.set('x-tenant-id', tenant.id);

  // Create a modified request with tenant headers for auth check
  const modifiedReq = new Request(req.url, {
    method: req.method,
    headers: requestHeaders,
    body: req.body,
  });

  // Check authentication status once for all logic
  const authStatus = await checkAuthStatus(modifiedReq);

  // Add admin status headers for conditional rendering
  requestHeaders.set(
    'x-user-authenticated',
    authStatus.authenticated ? 'true' : 'false'
  );
  if (authStatus.user) {
    requestHeaders.set('x-user-data', JSON.stringify(authStatus.user));
  }

  // Domain-based routing logic
  const hostname = host.toLowerCase();
  const isBandsyteCompany =
    hostname === 'bandsyte.com' || hostname === 'www.bandsyte.com';
  const isBandSite =
    hostname.includes('bandsyte.com') || isCustomDomain(hostname);

  // CRITICAL: Check auth routes BEFORE any rewrites
  if (isAuthRoute(url.pathname)) {
    if (authStatus.authenticated) {
      console.log(
        `🚪 [MIDDLEWARE] Redirecting authenticated user from ${url.pathname} to admin`
      );
      const redirectUrl = new URL('/admin/settings/theme', url.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle /admin redirect for authenticated users
  if (url.pathname === '/admin' && authStatus.authenticated) {
    const redirectUrl = new URL('/admin/settings/theme', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Route bandsyte.com to (bandsyte) route group
  if (isBandsyteCompany) {
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/(bandsyte)', url.origin));
    }
    if (url.pathname.startsWith('/company')) {
      return NextResponse.rewrite(
        new URL(`/(bandsyte)${url.pathname}`, url.origin)
      );
    }
  }

  // Route band sites (band.bandsyte.com, custom domains) to (public) or (admin)
  if (isBandSite) {
    // Admin routes → (admin) route group
    if (url.pathname.startsWith('/admin')) {
      // Check authentication for admin routes
      if (!authStatus.authenticated) {
        console.log(
          `🚫 [MIDDLEWARE] Unauthenticated access to admin route: ${url.pathname}`
        );
        return NextResponse.rewrite(new URL('/not-found', url.origin));
      }
      return NextResponse.rewrite(
        new URL(`/(admin)${url.pathname}`, url.origin)
      );
    }

    // Public routes → (public) route group
    return NextResponse.rewrite(
      new URL(`/(public)${url.pathname}`, url.origin)
    );
  }

  // Check authentication for admin routes (fallback)
  if (isAdminRoute(url.pathname)) {
    if (!authStatus.authenticated) {
      console.log(
        `🚫 [MIDDLEWARE] Unauthenticated access to admin route: ${url.pathname}`
      );
      return NextResponse.rewrite(new URL('/not-found', url.origin));
    }
  }

  // Handle /settings redirect for authenticated users
  if (url.pathname === '/settings' && authStatus.authenticated) {
    console.log(
      '🔄 [MIDDLEWARE] Redirecting /settings to /admin/settings/theme'
    );
    const redirectUrl = new URL('/admin/settings/theme', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Helper function to check if it's a custom domain
function isCustomDomain(hostname) {
  // Add your custom domain logic here
  // For now, assume any domain that's not bandsyte.com or localhost is a custom domain
  return (
    !hostname.includes('bandsyte.com') &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1')
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
