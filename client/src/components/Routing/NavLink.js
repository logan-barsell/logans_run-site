import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ActiveContext } from '../../contexts/ActiveContext';
import { fetchPublicMerchConfig } from '../../redux/actions';
import { shouldShowStoreNav } from '../../utils/merchConfigValidator';

const NavLink = ({ routes, menuToggle, footer }) => {
  const { setActiveIndex, activeIndex, toggle } = useContext(ActiveContext);
  const dispatch = useDispatch();
  const merchConfig = useSelector(state => state.merchConfig?.data);

  useEffect(() => {
    // Fetch public merch config to determine if Store nav should be shown
    dispatch(fetchPublicMerchConfig());
  }, [dispatch]);

  const onNavClick = index => {
    setActiveIndex(index);
    if (toggle === true) {
      menuToggle();
    }
    window.scrollTo({ top: 0 });
  };

  const renderedNavItems = routes
    .map((route, index) => {
      // Hide Store nav item if merch config is invalid or incomplete
      if (route.name === 'Store' && !shouldShowStoreNav(merchConfig)) {
        return null;
      }

      const active = index === activeIndex ? 'active' : '';
      const hvrSink = menuToggle && !toggle ? 'hvr-sink' : '';
      // Handle external store URLs differently
      if (
        route.name === 'Store' &&
        merchConfig?.storeType === 'external' &&
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
              window.scrollTo({ top: 0 });
            }}
          >
            {route.name}
          </a>
        );
      }

      return (
        <Link
          key={index}
          to={route.value}
          className={`nav-item nav-link ${hvrSink} ${active} ${
            footer ? 'footer-link' : ''
          }`}
          onClick={() => onNavClick(index)}
        >
          {route.name}
        </Link>
      );
    })
    .filter(Boolean); // Remove null items

  return renderedNavItems;
};

export default NavLink;
