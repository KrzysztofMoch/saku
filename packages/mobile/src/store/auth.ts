import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

type AuthState =
  | {
      authorized: true;
      skipped: boolean;
      accessToken: string;
      accessTokenExpiresAt: string;
      refreshToken: string;
      idToken: string;
    }
  | {
      authorized: false;
      skipped: boolean;
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
  skipped: false,
  accessToken: undefined,
  accessTokenExpiresAt: undefined,
  refreshToken: undefined,
  idToken: undefined,
};

const storage = new MMKV({
  id: 'auth-storage',
  encryptionKey: 'SUPER_SECRET_KEY',
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...initialState,
      setState: state => set(state),
      clearState: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export type { AuthState };
