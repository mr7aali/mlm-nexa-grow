import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthPayload, AuthUser } from "@/lib/api-types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
};

const tokenKey = "gioto_access_token";
const userKey = "gioto_user";

function readInitialState(): AuthState {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }

  try {
    const accessToken = window.localStorage.getItem(tokenKey);
    const userJson = window.localStorage.getItem(userKey);
    return {
      accessToken,
      user: userJson ? (JSON.parse(userJson) as AuthUser) : null,
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

function persistAuth(state: AuthState) {
  if (typeof window === "undefined") return;

  if (state.accessToken && state.user) {
    window.localStorage.setItem(tokenKey, state.accessToken);
    window.localStorage.setItem(userKey, JSON.stringify(state.user));
    return;
  }

  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(userKey);
}

const authSlice = createSlice({
  name: "auth",
  initialState: readInitialState(),
  reducers: {
    hydrateAuth(state) {
      const nextState = readInitialState();
      state.accessToken = nextState.accessToken;
      state.user = nextState.user;
    },
    setCredentials(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      persistAuth(state);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      persistAuth(state);
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      persistAuth(state);
    },
  },
});

export const { clearCredentials, hydrateAuth, setCredentials, setUser } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
