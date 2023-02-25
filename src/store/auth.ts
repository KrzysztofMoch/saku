import { create } from 'zustand';

type AuthState =
  | {
      authorized: true;
      accessToken: string;
      accessTokenExpiresAt: string;
      refreshToken: string;
      idToken: string;
    }
  | {
      authorized: false;
      accessToken: undefined;
      accessTokenExpiresAt: undefined;
      refreshToken: undefined;
      idToken: undefined;
    };

type AuthStore = AuthState & {
  setState: (state: AuthState) => void;
  clearState: () => void;
};

const initialState: AuthState = {
  authorized: false,
  accessToken: undefined,
  accessTokenExpiresAt: undefined,
  refreshToken: undefined,
  idToken: undefined,
};

export const useAuthStore = create<AuthStore>(set => ({
  ...initialState,
  setState: state => set(state),
  clearState: () => set(initialState),
}));

export type { AuthState };
