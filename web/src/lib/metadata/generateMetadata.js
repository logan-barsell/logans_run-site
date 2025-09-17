import { getTenantFromRequest } from '../../lib/tenancy/getTenantFromRequest';
import { getServerTheme } from '../../lib/theme/getServerTheme';
import { getServerBio } from '../../lib/bio/getServerBio';

/**
 * Generate dynamic metadata for site pages
 * @returns {Promise<Object>} Metadata object for Next.js
 */
export async function generateMetadata() {
  const tenant = await getTenantFromRequest();
  const [theme, bio] = await Promise.all([
    getServerTheme(tenant?.id),
    getServerBio(tenant?.id),
  ]);

  // Use bio text for description, with fallbacks
  let description = 'Music platform'; // Default fallback
  if (bio && bio.text) {
    // Clean up bio text for meta description (limit to 160 chars)
    description =
      bio.text.length > 160 ? bio.text.substring(0, 157) + '...' : bio.text;
  } else if (theme?.introduction) {
    // Fallback to theme introduction
    description =
      theme.introduction.length > 160
        ? theme.introduction.substring(0, 157) + '...'
        : theme.introduction;
  }

  // Generate favicon URL with fallback
  let faviconUrl = null;
  if (theme?.bandLogoUrl) {
    faviconUrl = theme.bandLogoUrl;
  } else if (theme?.siteTitle === 'Bandsyte') {
    // Use a default Bandsyte favicon for the default theme
    faviconUrl = '/favicon-bandsyte.ico';
  }

  return {
    title: theme?.siteTitle || 'Bandsyte',
    description,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}
