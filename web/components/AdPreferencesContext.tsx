"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdPreferencesContextType {
  isAdFree: boolean;
  toggleAdFree: () => void;
  setAdFree: (value: boolean) => void;
}

const AdPreferencesContext = createContext<AdPreferencesContextType>({
  isAdFree: false,
  toggleAdFree: () => {},
  setAdFree: () => {},
});

export function AdPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [isAdFree, setIsAdFree] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("newsflow_ad_free");
      if (stored === "true") {
        setIsAdFree(true);
      }
    } catch (e) {
      console.warn("Could not read ad preferences from localStorage", e);
    }
  }, []);

  const toggleAdFree = () => {
    setIsAdFree((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("newsflow_ad_free", String(next));
      } catch (e) {
        console.warn("Could not save ad preferences to localStorage", e);
      }
      return next;
    });
  };

  const setAdFree = (value: boolean) => {
    setIsAdFree(value);
    try {
      localStorage.setItem("newsflow_ad_free", String(value));
    } catch (e) {
      console.warn("Could not save ad preferences to localStorage", e);
    }
  };

  return (
    <AdPreferencesContext.Provider value={{ isAdFree, toggleAdFree, setAdFree }}>
      {children}
    </AdPreferencesContext.Provider>
  );
}

export function useAdPreferences() {
  return useContext(AdPreferencesContext);
}
