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

import * as React from "react";
import { useTheme } from "next-themes";

import HoverEffect from "../effects/HoverEffect";
import { Icon } from "@iconify/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    return theme === "light" ? "dark" : "light";
  };

  return (
    <HoverEffect
      className="w-8 h-8 p-1 flex justify-center items-center absolute top-1 right-1"
      onClick={() => setTheme(toggleTheme())}
    >
      <Icon
        icon={
          theme === "light"
            ? "line-md:sunny-filled-loop"
            : "line-md:moon-filled-loop"
        }
        width={32}
        height={32}
      />
    </HoverEffect>
  );
}
