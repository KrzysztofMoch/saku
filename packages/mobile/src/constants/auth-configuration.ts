import { AuthConfiguration } from 'react-native-app-auth';
import { AppDeepLinks } from './app-deeplinks';

export const AppAuthConfiguration: AuthConfiguration = {
  issuer: 'https://auth.mangadex.dev/realms/mangadex',
  clientId: 'thirdparty-oauth-client',
  redirectUrl: AppDeepLinks.AuthRedirect,
  scopes: ['openid', 'email', 'groups', 'profile', 'roles'],
};
