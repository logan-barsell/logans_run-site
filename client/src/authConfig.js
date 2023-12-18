const redirectUri = process.env.NODE_ENV === 'production' ? 'https://logans-run.com' : 'http://localhost:3000';

export const msalConfig = {
  auth: {
    clientId: '6553cec0-d1fb-4265-9630-a744cddd648c', // APP ID // app registrations
    authority: 'https://login.microsoftonline.com/372e0b0d-cdee-4804-b13a-2a954bcf6d2f', // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
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