import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri:  window.location.origin + '/callback',
  clientId: '648798311262-bk41l3qs500br4e0495eo69d3bfj7pj7.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'id_token token',
  strictDiscoveryDocumentValidation: false,
};