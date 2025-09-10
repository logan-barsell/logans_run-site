// utils/urls.js

const VALIDATION_PATTERNS = {
  facebook: [
    /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?fb\.com\/[^\/]+/,
  ],
  instagram: [
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?ig\.com\/[^\/]+/,
  ],
  tiktok: [
    /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?vm\.tiktok\.com\/[^\/]+/,
  ],
  youtube: [
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/[a-zA-Z0-9_-]+/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/[a-zA-Z0-9_-]+/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/[a-zA-Z0-9_-]+/,
  ],
  soundcloud: [/^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/[^\/]+/],
  spotify: [
    /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist|artist|episode|show)\/[a-zA-Z0-9]{22}/,
    /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/user\/[^\/]+/,
  ],
  appleMusic: [
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/(?:album|playlist)\/[^\/]+\/\d+/,
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/album\/[^\/]+\/\d+\?i=\d+/,
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/artist\/[^\/]+\/\d+/,
  ],
  x: [
    /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?x\.com\/[^\/]+/,
  ],
};

function validateSocialUrls(contactData) {
  const fields = [
    'facebook',
    'instagram',
    'youtube',
    'soundcloud',
    'spotify',
    'appleMusic',
    'x',
    'tiktok',
  ];
  for (const f of fields) {
    if (!contactData[f]) continue;
    const url = contactData[f].trim();
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      const err = new Error(`Invalid ${f} URL format`);
      err.statusCode = 400;
      throw err;
    }
    const patterns = VALIDATION_PATTERNS[f];
    if (patterns && !patterns.some(p => p.test(url))) {
      const err = new Error(
        `Invalid ${f} URL - must be a valid ${f} URL format`
      );
      err.statusCode = 400;
      throw err;
    }
  }
}

module.exports = { VALIDATION_PATTERNS, validateSocialUrls };
