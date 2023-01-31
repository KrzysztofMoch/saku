import { authorize, refresh, logout } from 'react-native-app-auth';
import { AppDeepLinks } from '../constants/app-deeplinks';
import { AppAuthConfiguration } from '../constants/auth-configuration';
import { persistor, store } from '../store';
import { clearAuth, setAuth } from '../store/state/authSlice';

const { dispatch, getState } = store;

export const authorize_user = async (): Promise<boolean> => {
  try {
    const result = await authorize(AppAuthConfiguration);

    const { accessToken, accessTokenExpirationDate, refreshToken, idToken } =
      result;

    dispatch(
      setAuth({
        access_token: accessToken,
        access_token_expiration_date: accessTokenExpirationDate,
        refresh_token: refreshToken,
        id_token: idToken,
      }),
    );

    return true;
  } catch (error) {
    return false;
  }
};

export const logout_user = async (force: boolean = false) => {
  try {
    const { id_token } = getState().auth;

    if (id_token && !force) {
      await logout(AppAuthConfiguration, {
        idToken: id_token,
        postLogoutRedirectUrl: AppDeepLinks.LogoutRedirect,
      });
    }
  } catch (error) {
    __DEV__ && console.error('LOGOUT ACTION ERROR', error);
  }

  dispatch(clearAuth());
  persistor.purge();
};

export const refresh_access_token = async (): Promise<boolean> => {
  try {
    const { refresh_token } = getState().auth;

    if (!refresh_token) {
      throw new Error('No refresh token found');
    }

    const result = await refresh(AppAuthConfiguration, {
      refreshToken: refresh_token,
    });

    const {
      accessToken,
      accessTokenExpirationDate,
      refreshToken: new_refresh_token,
      idToken,
    } = result;

    dispatch(
      setAuth({
        access_token: accessToken,
        access_token_expiration_date: accessTokenExpirationDate,
        refresh_token: new_refresh_token ?? refresh_token,
        id_token: idToken,
      }),
    );

    return true;
  } catch (error) {
    return false;
  }
};

export const is_user_authorized = async (): Promise<boolean> => {
  const { access_token, access_token_expiration_date } = getState().auth;

  if (!access_token || !access_token_expiration_date) {
    return false;
  }

  const expiration_date = new Date(access_token_expiration_date);

  if (expiration_date < new Date()) {
    return await refresh_access_token();
  }

  return true;
};
