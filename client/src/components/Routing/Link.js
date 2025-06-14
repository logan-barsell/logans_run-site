import React from 'react';
import '../Navbar/TopNav.css';

const Link = ({ className, href, children, onNavClick }) => {
  const onClick = event => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();

    onNavClick();

    window.history.pushState({}, '', href);

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return (
    <a
      onClick={onClick}
      className={className}
      href={href}
    >
      {children}
    </a>
  );
};

export default Link;
