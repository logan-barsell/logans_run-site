import { getTenantFromRequest } from '../../lib/tenancy/getTenantFromRequest';
import { getServerTheme } from '../../lib/theme/getServerTheme';

/**
 * Generate dynamic metadata for site pages
 * @returns {Promise<Object>} Metadata object for Next.js
 */
export async function generateMetadata() {
  const tenant = await getTenantFromRequest();
  const theme = await getServerTheme(tenant?.id);

  return {
    title: theme?.siteTitle || 'Bandsyte',
    description: 'Music platform',
    icons:
      theme?.favicon || theme?.bandLogoUrl
        ? {
            icon: theme.favicon || theme.bandLogoUrl,
          }
        : undefined,
  };
}
