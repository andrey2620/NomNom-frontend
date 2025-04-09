import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/callback',
  clientId: '648798311262-bk41l3qs500br4e0495eo69d3bfj7pj7.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  requireHttps: false,
  showDebugInformation: true,
  useHttpBasicAuth: false,
  disablePKCE: false
};
