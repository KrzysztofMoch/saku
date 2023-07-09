import { authorize, logout, refresh } from 'react-native-app-auth';

import { AppDeepLinks } from '@constants/app-deeplinks';
import { AppAuthConfiguration } from '@constants/auth-configuration';
import { useAuthStore } from '@store/auth';

const { getState } = useAuthStore;

export const authorize_user = async (): Promise<boolean> => {
  try {
    const result = await authorize(AppAuthConfiguration);

    const { accessToken, accessTokenExpirationDate, refreshToken, idToken } =
      result;

    useAuthStore.setState({
      authorized: true,
      accessToken,
      accessTokenExpiresAt: accessTokenExpirationDate,
      refreshToken,
      idToken,
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const logout_user = async (force: boolean = false) => {
  const { idToken, clearState } = getState();

  try {
    if (idToken && !force) {
      await logout(AppAuthConfiguration, {
        idToken: idToken,
        postLogoutRedirectUrl: AppDeepLinks.LogoutRedirect,
      });
    }
  } catch (error) {
    __DEV__ && console.error('LOGOUT ACTION ERROR', error);
  }

  clearState();
};

export const refresh_access_token = async (): Promise<boolean> => {
  try {
    const { refreshToken, setState } = getState();

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const result = await refresh(AppAuthConfiguration, {
      refreshToken: refreshToken,
    });

    const {
      accessToken,
      accessTokenExpirationDate,
      refreshToken: new_refresh_token,
      idToken,
    } = result;

    setState({
      authorized: true,
      accessToken,
      accessTokenExpiresAt: accessTokenExpirationDate,
      refreshToken: new_refresh_token ?? refreshToken,
      idToken,
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const is_user_authorized = async (): Promise<boolean> => {
  const { authorized, accessTokenExpiresAt } = getState();

  if (!authorized) {
    return false;
  }

  const expiration_date = new Date(accessTokenExpiresAt);

  if (expiration_date < new Date()) {
    return await refresh_access_token();
  }

  return true;
};
