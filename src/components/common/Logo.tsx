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

import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Logo() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <span
      className="flex items-center justify-center gap-4 cursor-pointer"
      onClick={() => router.push("/")}
    >
      <Image
        alt="OopsBudgeter Logo"
        src={theme === "light" ? "/logo.png" : "/logo_dark.png"}
        width={512}
        height={512}
        className="h-9 w-9"
        draggable={false}
      />
      <h2 className="text-2xl font-semibold">OopsBudgeter</h2>
    </span>
  );
}
