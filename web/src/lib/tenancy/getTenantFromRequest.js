import { headers } from 'next/headers';
import { resolveTenantFromHost } from './resolveTenant';

/**
 * SSR helper to get tenant from request headers or host.
 */
export async function getTenantFromRequest() {
  const h = await headers();
  const injectedTenantId = h.get('x-tenant-id');
  if (injectedTenantId) {
    return { id: injectedTenantId, slug: null, source: 'header' };
  }

  const host = h.get('host') || '';
  const devOverride = process.env.DEV_TENANT_ID || '';
  return resolveTenantFromHost(host, devOverride);
}
