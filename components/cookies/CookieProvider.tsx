// components/CookieProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { CookieConsentManager } from "./cookieConsentManager";

interface CookieProviderProps {
  children: ReactNode;
}

const CookieContext = createContext({});

export function CookieProvider({ children }: CookieProviderProps) {
  return (
    <CookieContext.Provider value={{}}>
      {children}
      <CookieConsentManager />
    </CookieContext.Provider>
  );
}
