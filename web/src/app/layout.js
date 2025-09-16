import 'bootstrap/dist/css/bootstrap.min.css'; // 1. Bootstrap base
import './globals.css'; // 2. Theme variables
import './App.css'; // 3. Custom overrides
import Providers from './providers';
import PaceLoader from '../components/PaceLoader';
import Script from 'next/script';
import { getTenantFromRequest } from '../lib/tenancy/getTenantFromRequest';
import { getServerTheme } from '../lib/theme/getServerTheme';
import { generateStyleString } from '../lib/theme/generateStyleObject';
import { getSecurityHeaders } from '../lib/security';

export const metadata = {
  title: 'Bandsyte',
  description: 'Music platform',
};

// Export security headers for Next.js
export const headers = getSecurityHeaders();

export default async function RootLayout({ children }) {
  // Fetch theme and tenant data server-side
  const tenant = await getTenantFromRequest();
  const theme = await getServerTheme(tenant?.id);

  // Generate CSS variables as CSS string for :root
  const themeCSS = generateStyleString(theme);

  return (
    <html
      lang='en'
      data-scroll-behavior='smooth'
    >
      <head>
        {/* Inject CSS variables early - using React's style prop for security */}
        <style id='theme-variables'>{themeCSS}</style>
        <PaceLoader />
      </head>
      <body>
        {/* Inject theme data securely via data attributes */}
        <div
          id='theme-data'
          data-theme={JSON.stringify(theme)}
          style={{ display: 'none' }}
        />
        <Providers
          theme={theme}
          tenant={tenant}
        >
          {children}
        </Providers>
        {/* Load theme-loader.js first to configure pace */}
        <Script
          src='/theme-loader.js'
          strategy='afterInteractive'
        />
        {/* Load pace.js after theme configuration */}
        <Script
          src='/pace.min.js'
          strategy='afterInteractive'
        />
        {/* External Scripts using Next.js Script component */}
        <Script
          src='https://js.stripe.com/v3/buy-button.js'
          strategy='afterInteractive'
        />
        <Script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p'
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
        <Script
          src='https://widget.bandsintown.com/main.min.js'
          strategy='afterInteractive'
        />
      </body>
    </html>
  );
}
