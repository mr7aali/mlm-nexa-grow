import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthPayload, AuthUser } from "@/lib/api-types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};

const tokenKey = "gioto_access_token";
const userKey = "gioto_user";
const initialState: AuthState = {
  accessToken: null,
  user: null,
  hydrated: false,
};

function readPersistedAuth(): Pick<AuthState, "accessToken" | "user"> {
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
  initialState,
  reducers: {
    hydrateAuth(state) {
      const nextState = readPersistedAuth();
      state.accessToken = nextState.accessToken;
      state.user = nextState.user;
      state.hydrated = true;
    },
    setCredentials(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.hydrated = true;
      persistAuth(state);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.hydrated = true;
      persistAuth(state);
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      state.hydrated = true;
      persistAuth(state);
    },
  },
});

export const { clearCredentials, hydrateAuth, setCredentials, setUser } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
