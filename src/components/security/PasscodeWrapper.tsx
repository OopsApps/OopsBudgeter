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

import React, { useEffect, useState } from "react";
import PasscodePrompt from "./PasscodePrompt";

export default function PasscodeWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPasscode = localStorage.getItem("passcode");
    const storedExpiryTime = localStorage.getItem("expiryTime");
    const currentTime = new Date().getTime();

    if (
      !storedPasscode ||
      !storedExpiryTime ||
      currentTime > parseInt(storedExpiryTime)
    ) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const handlePasscodeValid = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) return null;

  return (
    <div>
      {!isAuthenticated ? (
        <PasscodePrompt onPasscodeValid={handlePasscodeValid} />
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
