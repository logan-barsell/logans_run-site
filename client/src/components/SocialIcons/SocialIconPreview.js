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

// SocialIconPreview component - shows all icons for preview purposes
// This is different from SocialIcons which only shows icons with actual links
const SocialIconPreview = ({ style = 'default', className = '' }) => {
  const platforms = [
    { name: 'Facebook', icon: Facebook },
    { name: 'Instagram', icon: Instagram },
    { name: 'YouTube', icon: YouTube },
    { name: 'Spotify', icon: Spotify },
    { name: 'Apple Music', icon: AppleMusic },
    { name: 'SoundCloud', icon: SoundCloud },
    { name: 'X (Twitter)', icon: X },
    { name: 'TikTok', icon: TikTok },
  ];

  const containerClasses = ['social-icons', 'social-icons--preview', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <span
        className='secondary-font'
        style={{
          fontSize: '14px',
          opacity: 0.8,
          color: 'white',
          marginRight: '8px',
        }}
      >
        Preview:
      </span>
      <div className='d-flex gap-1 justify-content-center align-items-center text-white flex-wrap'>
        {platforms.map(({ name, icon: IconComponent }) => (
          <div
            key={name}
            className='social-icon-link'
            title={name}
          >
            <IconComponent style={style} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialIconPreview;
