import { apiFetch } from '../api/serverFetch';
import { defaultTheme } from './defaultTheme';

export async function getServerTheme(tenantId) {
  try {
    const res = await apiFetch('/theme', {
      method: 'GET',
      headers: {
        'x-tenant-id': tenantId,
      },
    });
    if (!res.ok) {
      console.error('Error loading theme:', res.status);
      return defaultTheme;
    }
    const json = await res.json();
    // Expecting shape { success: boolean, data: {...} }
    const theme = json?.data || defaultTheme;
    return theme;
  } catch (e) {
    console.error('Error loading theme:', e);
    // Server-side fallback to default theme
    return defaultTheme;
  }
}
