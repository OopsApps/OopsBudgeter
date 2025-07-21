/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AppContextType = {
  appWidth: string;
  setAppWidth: (width: string) => void;
  colorfulCategories: string;
  setColorfulCategories: (boolean: string) => void;
  colorfulTransactions: string;
  setColorfulTransactions: (boolean: string) => void;
  soundEffects: string;
  setSoundEffects: (boolean: string) => void;
  showOriginalAmount: string;
  setShowOriginalAmount: (value: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [appWidth, setAppWidth] = useState(() => {
    return localStorage.getItem("appWidth") || "Normal";
  });
  const [colorfulCategories, setColorfulCategories] = useState(() => {
    return localStorage.getItem("colorfulCategories") || "On";
  });
  const [colorfulTransactions, setColorfulTransactions] = useState(() => {
    return localStorage.getItem("colorfulTransactions") || "Off";
  });
  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem("soundEffects") || "Off";
  });
  const [showOriginalAmount, setShowOriginalAmount] = useState(() => {
    return localStorage.getItem("showOriginalAmount") || "Off";
  });

  useEffect(() => {
    localStorage.setItem("appWidth", appWidth);
  }, [appWidth]);

  useEffect(() => {
    localStorage.setItem("colorfulCategories", colorfulCategories);
  }, [colorfulCategories]);

  useEffect(() => {
    localStorage.setItem("colorfulTransactions", colorfulTransactions);
  }, [colorfulTransactions]);

  useEffect(() => {
    localStorage.setItem("soundEffects", soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem("showOriginalAmount", showOriginalAmount);
  }, [showOriginalAmount]);

  return (
    <AppContext.Provider
      value={{
        appWidth,
        setAppWidth,
        colorfulCategories,
        setColorfulCategories,
        colorfulTransactions,
        setColorfulTransactions,
        soundEffects,
        setSoundEffects,
        showOriginalAmount,
        setShowOriginalAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
