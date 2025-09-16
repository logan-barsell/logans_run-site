/**
 * Security headers configuration for Next.js app
 * Provides CSP, XSS protection, and other security headers
 */

export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net https://widget.bandsintown.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://api.stripe.com https://widget.bandsintown.com",
    "frame-src 'self' https://js.stripe.com https://widget.bandsintown.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

/**
 * Get security headers for Next.js layout
 * @returns {Object} Headers object for Next.js
 */
export function getSecurityHeaders() {
  return securityHeaders;
}
