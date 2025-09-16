import { headers } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function apiFetch(path, init = {}) {
  const incomingHeaders = await headers();
  const tenantId = incomingHeaders.get('x-tenant-id');

  const h = new Headers(init.headers || {});
  if (tenantId) h.set('x-tenant-id', tenantId);

  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: h,
    credentials: 'include',
    cache: init.cache || 'no-store',
  });
  return res;
}
