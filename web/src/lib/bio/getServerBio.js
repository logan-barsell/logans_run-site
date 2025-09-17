import { apiFetch } from '../api/serverFetch';

export async function getServerBio(tenantId) {
  try {
    const res = await apiFetch('/bio', {
      method: 'GET',
      headers: {
        'x-tenant-id': tenantId,
      },
    });
    if (!res.ok) {
      console.error('Error loading bio:', res.status);
      return null;
    }
    const json = await res.json();
    // Expecting shape { success: boolean, data: {...} }
    const bio = json?.data;
    return bio;
  } catch (e) {
    console.error('Error loading bio:', e);
    return null;
  }
}
