import {
  HEADER_DISPLAY_OPTIONS,
  HEADER_POSITION_OPTIONS,
} from './headerOptions';
import { PRIMARY_FONT_OPTIONS, SECONDARY_FONT_OPTIONS } from './fontOptions';
import { SOCIAL_MEDIA_ICON_STYLE_OPTIONS } from './socialMediaOptions';
import { PACE_THEME_OPTIONS } from './animationOptions';

// Theme form fields configuration
export const THEME_FIELDS = [
  // Basic Information Section
  {
    name: 'bandLogo',
    type: 'image',
    label: 'Icon Logo',
    required: false,
    helperText:
      'Upload a square icon (e.g., 512×512) used for favicon and icon logo',
  },
  {
    name: 'bandHeaderLogo',
    type: 'image',
    label: 'Header Logo',
    required: false,
    helperText: 'Upload a wide logo (e.g., 800×200) used in the header',
  },
  { type: 'divider' },
  {
    name: 'siteTitle',
    type: 'text',
    label: 'Band Name',
    required: false,
    placeholder: 'Enter your band name',
  },
  {
    name: 'greeting',
    type: 'text',
    label: 'Greeting',
    required: false,
    placeholder: 'Enter your greeting (e.g., HELLO., WELCOME., ROCK ON.)',
  },
  {
    name: 'introduction',
    type: 'text',
    label: 'Introduction',
    required: false,
    placeholder:
      'Enter your introduction (e.g., We are a punk rock band from Seattle)',
  },

  // Divider
  {
    type: 'divider',
  },

  // Header & Navigation Section
  {
    name: 'headerDisplay',
    type: 'dropdown',
    label: 'Header Display',
    options: HEADER_DISPLAY_OPTIONS,
    required: true,
  },
  {
    name: 'headerPosition',
    type: 'dropdown',
    label: 'Header Position',
    options: HEADER_POSITION_OPTIONS,
    required: true,
  },
  {
    type: 'divider',
  },

  // Colors Section
  {
    name: 'primaryColor',
    type: 'color',
    label: 'Primary Color',
    colorType: 'primary',
    required: true,
  },
  {
    name: 'secondaryColor',
    type: 'color',
    label: 'Secondary Color',
    colorType: 'secondary',
    required: true,
  },
  {
    name: 'backgroundColor',
    type: 'color',
    label: 'Background Color',
    colorType: 'background',
    required: true,
  },

  // Divider
  {
    type: 'divider',
  },

  {
    name: 'primaryFont',
    type: 'font',
    label: 'Primary Font',
    optgroups: PRIMARY_FONT_OPTIONS,
    required: true,
  },
  {
    name: 'secondaryFont',
    type: 'font',
    label: 'Secondary Font',
    optgroups: SECONDARY_FONT_OPTIONS,
    required: true,
  },

  // Divider
  {
    type: 'divider',
  },

  {
    name: 'socialMediaIconStyle',
    type: 'socialMediaIconStyle',
    label: 'Social Media Icon Style',
    options: SOCIAL_MEDIA_ICON_STYLE_OPTIONS,
    required: true,
  },
  {
    name: 'paceTheme',
    type: 'font',
    label: 'Loading Animation Style',
    optgroups: PACE_THEME_OPTIONS,
    required: true,
    placeholder: 'Select an animation style',
  },
];
