const redirectUri = process.env.NODE_ENV === 'production' ? 'https://yesdevil.com' : 'http://localhost:3000';

export const msalConfig = {
  auth: {
    clientId: 'ee2c531a-b402-4bd5-ab01-df3ff3900ab0',
    authority: 'https://login.microsoftonline.com/5184daaf-16a2-479b-8174-79d2e7257401', // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};