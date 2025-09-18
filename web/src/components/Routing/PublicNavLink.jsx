'use client';
import React, { useContext, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { ActiveContext } from '../../contexts/ActiveContext';
import { usePublicNavigationContext } from '../../contexts/PublicNavigationProvider';
import { fetchPublicMerchConfig } from '../../redux/actions';
import { shouldShowStoreNav } from '../../lib/validation';

export default function PublicNavLink({ routes = [], menuToggle, footer }) {
  const { setActiveIndex, activeIndex, toggle } = useContext(ActiveContext);
  const { navigate, isNavigating } = usePublicNavigationContext();
  const dispatch = useDispatch();
  const merchConfig = useSelector(state => state.merchConfig?.data);

  useEffect(() => {
    // Fetch public merch config to determine if Store nav should be shown
    dispatch(fetchPublicMerchConfig());
  }, [dispatch]);

  const onNavClick = useCallback(
    (route, index, event) => {
      // Prevent default Link behavior
      event.preventDefault();

      setActiveIndex(index);
      if (toggle === true) {
        menuToggle();
      }
      // Use instant navigation for public routes
      navigate(route.value, { scroll: true });
    },
    [setActiveIndex, toggle, menuToggle, navigate]
  );

  const renderedNavItems = routes
    .map((route, index) => {
      // Hide Store nav item if merch config is invalid or incomplete
      if (route.name === 'Store' && !shouldShowStoreNav(merchConfig)) {
        return null;
      }

      const active = index === activeIndex ? 'active' : '';
      const hvrSink = menuToggle && !toggle ? 'hvr-sink' : '';
      const loading = isNavigating ? 'loading' : '';

      // Handle external store URLs differently (same as original NavLink)
      if (
        route.name === 'Store' &&
        merchConfig?.storeType === 'EXTERNAL' &&
        merchConfig?.storefrontUrl
      ) {
        return (
          <a
            key={index}
            href={merchConfig.storefrontUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={`nav-item nav-link ${hvrSink} ${
              footer ? 'footer-link' : ''
            }`}
            style={{ color: 'white' }}
            onClick={() => {
              // Don't set active index for external links
              if (toggle === true) {
                menuToggle();
              }
              if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
            }}
          >
            {route.name}
          </a>
        );
      }

      // Use Next.js Link but intercept clicks for instant navigation
      return (
        <Link
          key={index}
          href={route.value}
          className={`nav-item nav-link ${hvrSink} ${active} ${loading} ${
            footer ? 'footer-link' : ''
          }`}
          onClick={event => onNavClick(route, index, event)}
        >
          {route.name}
          {isNavigating && <span className='ms-2'>⟳</span>}
        </Link>
      );
    })
    .filter(Boolean);

  return renderedNavItems;
}
