import React from 'react';
import {
  Facebook,
  Instagram,
  TikTok,
  YouTube,
  X,
  Spotify,
  AppleMusic,
  SoundCloud,
} from '../icons';
import './SocialIcons.css';

// Platform configuration with display names and icons
const PLATFORM_CONFIG = {
  facebook: { name: 'Facebook', icon: Facebook },
  instagram: { name: 'Instagram', icon: Instagram },
  tiktok: { name: 'TikTok', icon: TikTok },
  youtube: { name: 'YouTube', icon: YouTube },
  x: { name: 'X (Twitter)', icon: X },
  spotify: { name: 'Spotify', icon: Spotify },
  appleMusic: { name: 'Apple Music', icon: AppleMusic },
  soundCloud: { name: 'SoundCloud', icon: SoundCloud },
};

const SocialIcons = ({
  links = {},
  variant = 'default', // 'default', 'member', 'contact', 'footer', 'music'
  size = 'default', // 'small', 'default', 'large'
  className = '',
  showLabels = false,
  theme,
  ...props
}) => {
  // Filter out empty/null links
  const activePlatforms = Object.entries(links).filter(
    ([platform, url]) => url && url.trim() && PLATFORM_CONFIG[platform]
  );

  if (activePlatforms.length === 0) {
    return null;
  }

  const containerClasses = [
    'social-icons',
    `social-icons--${variant}`,
    `social-icons--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClasses}
      {...props}
    >
      {activePlatforms.map(([platform, url]) => {
        const config = PLATFORM_CONFIG[platform];
        const IconComponent = config.icon;

        return (
          <a
            key={platform}
            href={url}
            target='_blank'
            rel='noreferrer'
            className='social-icon-link hvr-grow'
            aria-label={`Visit our ${config.name} page`}
            title={config.name}
          >
            <IconComponent
              style={
                theme?.socialMediaIconStyle === 'COLORFUL'
                  ? 'colorful'
                  : 'default'
              }
            />
            {showLabels && (
              <span className='social-icon-label'>{config.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
