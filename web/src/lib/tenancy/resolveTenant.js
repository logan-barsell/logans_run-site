/**
 * Resolve tenant by host or dev override.
 * - For localhost, prefer ?tenant= or DEV_TENANT_ID env.
 * - For subdomains like slug.bandsyte.com, return { slug }.
 * - For www.bandsyte.com, return { slug: 'bandsyte' } as canonical.
 * This module is isomorphic; avoid Next APIs here.
 */
export function resolveTenantFromHost(host, devOverride) {
  const normalizedHost = (host || '').toLowerCase().trim();

  if (devOverride) {
    return { id: devOverride, slug: null, source: 'dev-override' };
  }

  if (!normalizedHost) return null;

  // IPv6 localhost often appears as [::1]
  const isLocalhost =
    normalizedHost.includes('localhost') ||
    normalizedHost.includes('127.0.0.1') ||
    normalizedHost.includes('[::1]');

  if (isLocalhost) {
    // No slug on localhost unless override present
    return null;
  }

  // Strip port if present
  const hostNoPort = normalizedHost.split(':')[0];
  const parts = hostNoPort.split('.');

  if (parts.length <= 2) {
    // apex like bandsyte.com or www.bandsyte.com → default bandsyte tenant
    return { id: null, slug: 'bandsyte', source: 'apex' };
  }

  const [subdomain] = parts;
  if (!subdomain || subdomain === 'www') {
    return { id: null, slug: 'bandsyte', source: 'apex-www' };
  }

  return { id: null, slug: subdomain, source: 'subdomain' };
}
