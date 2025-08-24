const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// Extract domain for cookies (remove protocol and port)
const getDomain = url => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    // Fallback for localhost
    return 'localhost';
  }
};

const config = {
  appEnv: process.env.NODE_ENV || 'development',
  apiURL: `${serverUrl}/api`,
  clientURL: clientUrl,
  domain: getDomain(serverUrl),
  appName: 'Logans Run',
};

module.exports = config;
