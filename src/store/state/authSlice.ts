import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  access_token: string | undefined;
  access_token_expiration_date: string | undefined;
  refresh_token: string | undefined;
  id_token: string | undefined;
}

const initialState: AuthState = {
  access_token: undefined,
  access_token_expiration_date: undefined,
  refresh_token: undefined,
  id_token: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.access_token = action.payload.access_token;
      state.access_token_expiration_date =
        action.payload.access_token_expiration_date;
      state.refresh_token = action.payload.refresh_token;
      state.id_token = action.payload.id_token;
    },
    clearAuth: state => {
      state = initialState;
      return state;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
