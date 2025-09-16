import { generateMetadata } from '../../lib/metadata/generateMetadata';
import Link from 'next/link';

// Re-export generateMetadata from utils
export { generateMetadata };

export default function BandsyteLayout({ children }) {
  return (
    <div className='d-flex flex-column min-vh-100'>
      {/* Bandsyte company navigation will be added here */}
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className='container'>
          <Link
            className='navbar-brand'
            href='/company'
          >
            <strong>Bandsyte</strong>
          </Link>
          <div className='navbar-nav ms-auto'>
            <Link
              className='nav-link'
              href='/company/features'
            >
              Features
            </Link>
            <Link
              className='nav-link'
              href='/company/pricing'
            >
              Pricing
            </Link>
            <Link
              className='nav-link'
              href='/company/about'
            >
              About
            </Link>
            <Link
              className='nav-link'
              href='/company/signup'
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className='flex-grow-1'>{children}</main>

      {/* Bandsyte footer will be added here */}
      <footer className='bg-dark text-light py-4'>
        <div className='container text-center'>
          <p>&copy; 2024 Bandsyte. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
