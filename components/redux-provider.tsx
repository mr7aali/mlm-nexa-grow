"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { hydrateAuth } from "@/lib/auth-slice";
import { store } from "@/lib/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
