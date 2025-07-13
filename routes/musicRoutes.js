const SpotifyPlayer = require('../models/SpotifyPlayer');

// Spotify URL validation patterns
const SPOTIFY_PATTERNS = {
  track: /^https?:\/\/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})/,
  album: /^https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]{22})/,
  playlist: /^https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]{22})/,
};

const SUPPORTED_TYPES = ['track', 'album', 'playlist'];

// Validation function
const validateSpotifyUrl = url => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required and must be a string' };
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  try {
    new URL(trimmedUrl);
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }

  for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      if (!SUPPORTED_TYPES.includes(type)) {
        return {
          isValid: false,
          error: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } URLs are not supported for embedding`,
        };
      }
      return { isValid: true, type, id: match[1] };
    }
  }

  return {
    isValid: false,
    error: 'Not a valid Spotify URL. Must be a track, album, or playlist URL',
  };
};

module.exports = app => {
  app.post('/api/addPlayer', async (req, res) => {
    try {
      const { spotifyLink } = req.body;

      // Validate Spotify URL
      const validation = validateSpotifyUrl(spotifyLink);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      const newPlayer = new SpotifyPlayer(req.body);
      await newPlayer.save();
      res.status(200).send(newPlayer);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/updatePlayer', async (req, res) => {
    try {
      const { spotifyLink } = req.body;

      // Validate Spotify URL
      const validation = validateSpotifyUrl(spotifyLink);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      const updatedPlayer = req.body;
      await SpotifyPlayer.updateOne({ _id: updatedPlayer._id }, updatedPlayer);
      res.status(200).send(updatedPlayer);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/deletePlayer/:id', async (req, res) => {
    try {
      await SpotifyPlayer.findByIdAndDelete(req.params.id);
      res.status(200).send('deleted');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/getPlayer/:id', async (req, res) => {
    try {
      const player = await SpotifyPlayer.findById(req.params.id);
      res.status(200).send(player);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/getPlayers', async (req, res) => {
    try {
      const players = await SpotifyPlayer.find().sort({ date: -1 });
      res.status(200).send(players);
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
