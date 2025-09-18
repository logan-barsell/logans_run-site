// Header display options - using HeaderDisplay enum values
export const HEADER_DISPLAY_OPTIONS = [
  { value: 'BAND_NAME_ONLY', label: 'Band Name Only' },
  { value: 'BAND_NAME_AND_LOGO', label: 'Band Name and Icon Logo' },
  { value: 'LOGO_ONLY', label: 'Icon Logo Only' },
  // Only applies when a header logo exists; UI can conditionally show/enable
  { value: 'HEADER_LOGO_ONLY', label: 'Header Logo Only' },
];

// Header position options - using HeaderPosition enum values
export const HEADER_POSITION_OPTIONS = [
  { value: 'LEFT', label: 'Left' },
  { value: 'CENTER', label: 'Center' },
  { value: 'RIGHT', label: 'Right' },
];
