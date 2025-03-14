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

import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import HoverEffect from "../effects/HoverEffect";
import { ThemeToggle } from "../common/ThemeToggle";
import { useIsClient } from "@/hooks/useclient";

export default function PasscodePrompt({
  onPasscodeValid,
}: {
  onPasscodeValid: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();

  const handleSubmit = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passcode }),
    });

    const data = await response.json();

    if (data.message === "Login successful") {
      const currentTime = new Date().getTime();
      const expiryTime = currentTime + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("passcode", passcode);
      localStorage.setItem("expiryTime", expiryTime.toString());
      onPasscodeValid();
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <HoverEffect
        bgColor="#292929"
        className="flex flex-col items-center justify-between p-10 max-w-sm max-h-60 bg-secondary"
      >
        <ThemeToggle />
        <h2>Enter Pin</h2>
        <InputOTP
          maxLength={6}
          onChange={(value) => {
            setPasscode(value);
          }}
          value={passcode}
          className="text-red-400"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <HoverEffect
          className="max-w-24 max-h-10 flex items-center justify-center"
          bgColor="#684444"
          onClick={() => handleSubmit()}
        >
          Confirm
        </HoverEffect>
        {error && (
          <div className="bg-red-500/25 text-red-500 rounded-lg p-1 px-2 text-sm absolute bottom-1.5">
            {error}
          </div>
        )}
      </HoverEffect>
    </div>
  );
}
