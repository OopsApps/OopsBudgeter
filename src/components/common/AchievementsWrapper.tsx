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

import { achievements } from "@/constants/achievements";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AchievementsWrapper() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUnlocked() {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnlockedIds(data.map((a) => a.id?.toString?.() ?? a.toString()));
      } else {
        console.error("Invalid achievements data:", data);
      }
    }
    fetchUnlocked();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Achievements 🎯</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {achievements.map((a) => {
          const unlocked = unlockedIds.includes(a.id);
          return (
            <div
              key={a.id}
              className={cn(
                "relative p-4 border rounded-lg shadow-sm transition group overflow-hidden",
                unlocked
                  ? "bg-white dark:bg-zinc-900 text-black dark:text-white border-green-500"
                  : "bg-black/10 dark:bg-black/30 opacity-60"
              )}
            >
              <Image
                src={`/achievements/${a.id}.png`}
                alt={a.title}
                fill
                className={cn(
                  "object-cover z-0 opacity-30 transition-all",
                  unlocked ? "" : "blur-sm grayscale"
                )}
              />
              {!unlocked && (
                <div className="absolute top-2 right-2 bg-black/60 dark:bg-black/70 flex items-center justify-center z-10 rounded-lg">
                  <Icon
                    icon="lets-icons:lock-fill"
                    className="text-white w-6 h-6"
                  />
                </div>
              )}
              <div className={cn("relative z-20")}>
                <h2 className="text-lg font-semibold">{a.title}</h2>
                <p className="text-sm mt-1">{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
