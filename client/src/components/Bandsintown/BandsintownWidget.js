// BandsintownWidget.js
// Reusable component for rendering the Bandsintown widget
// Props:
//   artistName (string): The Bandsintown artist name or id (e.g., 'Metallica' or 'id_15516202')
//   style (object, optional): Additional styles to apply to the widget container
//
// Usage:
//   <BandsintownWidget artistName="Metallica" />

import React, { useEffect, useRef, useState } from 'react';
import ErrorMessage from '../ErrorMessage';

const BandsintownWidget = ({ artistName, style }) => {
  const widgetContainerRef = useRef(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);

    const container = widgetContainerRef.current;
    if (artistName && container) {
      container.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'bit-widget-initializer';
      widgetDiv.setAttribute('data-artist-name', artistName);
      widgetDiv.setAttribute('data-display-local-dates', 'false');
      widgetDiv.setAttribute('data-display-past-dates', 'false');
      widgetDiv.setAttribute('data-auto-style', 'true');
      widgetDiv.setAttribute('data-text-color', '#ffffff');
      widgetDiv.setAttribute('data-link-color', '#00b4b3');
      widgetDiv.setAttribute('data-background-color', 'rgba(0,0,0,0)');
      widgetDiv.setAttribute('data-display-limit', '15');
      widgetDiv.setAttribute('data-display-start-time', 'true');
      widgetDiv.setAttribute('data-link-text-color', '#00b4b3');
      widgetDiv.setAttribute('data-display-lineup', 'false');
      widgetDiv.setAttribute('data-display-play-my-city', 'false');
      widgetDiv.setAttribute('data-separator-color', 'rgba(255,255,255,0.2)');
      widgetDiv.style.background = 'rgba(0,0,0,0.6)';
      widgetDiv.style.padding = '16px';
      widgetDiv.style.borderRadius = '8px';
      widgetDiv.style.fontFamily = 'var(--secondary-font)';
      if (style) {
        Object.assign(widgetDiv.style, style);
      }
      container.appendChild(widgetDiv);

      // Remove any existing Bandsintown widget script
      const existingScript = document.querySelector(
        'script[src="https://widget.bandsintown.com/main.min.js"]'
      );
      if (existingScript) {
        existingScript.parentNode.removeChild(existingScript);
      }

      // Add the script again
      const script = document.createElement('script');
      script.src = 'https://widget.bandsintown.com/main.min.js';
      script.async = true;
      document.body.appendChild(script);

      // Check for "not found" after a short delay
      const timeout = setTimeout(() => {
        const bitContainer = container.querySelector('.bit-widget-container');
        if (
          !bitContainer ||
          !bitContainer.innerText.trim() ||
          bitContainer.innerHTML === '<div></div>'
        ) {
          setNotFound(true);
        }
      }, 1500); // 1.5 seconds

      // Clean up script, widget, and timeout on unmount
      return () => {
        clearTimeout(timeout);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, [artistName, style]);

  return (
    <>
      {notFound && (
        <ErrorMessage>
          Sorry, this artist was not found on Bandsintown.
        </ErrorMessage>
      )}
      <div ref={widgetContainerRef} />
    </>
  );
};

export default BandsintownWidget;
