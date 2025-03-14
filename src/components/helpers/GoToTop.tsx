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
import HoverEffect from "../effects/HoverEffect";
import { Icon } from "@iconify/react";
import { useIsClient } from "@/hooks/useclient";

export default function GoToTop() {
  const [position, setPosition] = useState(0);
  const [isUpActive, setIsUpActive] = useState(false);
  const [isDownActive, setIsDownActive] = useState(false);

  const isClient = useIsClient();

  const goToTop = () => {
    if (!isClient) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToBottom = () => {
    if (!isClient) return;
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isClient) return;
    window.addEventListener("scroll", () => setPosition(window.scrollY));
    setIsUpActive(position > 100);
    setIsDownActive(position < document.body.scrollHeight);

    return () => window.removeEventListener("scroll", () => setPosition(0));
  }, [isUpActive, position, isClient]);

  return (
    <div className="right-6 bottom-3 z-50 fixed items-center md:space-x-2 flex flex-col md:flex-row gap-2 md:gap-0">
      {isDownActive && (
        <HoverEffect
          onClick={goToBottom}
          isRounded
          className="rounded-full border border-primary/20 bg-opacity-25 bg-neutral-100 hover:bg-neutral-300/20 dark:bg-neutral-800/30  dark:text-white/80 dark:hover:text-white/90 dark:hover:bg-opacity-40 min-h-10 min-w-14 transition-colors px-4 py-1.5 flex justify-center items-center"
        >
          <Icon icon="line-md:arrow-down" width={22} />
        </HoverEffect>
      )}
      {isUpActive && (
        <HoverEffect
          onClick={goToTop}
          isRounded
          className="rounded-full border border-primary/20 bg-opacity-25 bg-neutral-100 hover:bg-neutral-300/20 dark:bg-neutral-800/30  dark:text-white/80 dark:hover:text-white/90 dark:hover:bg-opacity-40 min-h-10 min-w-14 transition-colors px-4 py-1.5 flex justify-center items-center"
        >
          <Icon icon="line-md:arrow-up" width={22} />
        </HoverEffect>
      )}
    </div>
  );
}
