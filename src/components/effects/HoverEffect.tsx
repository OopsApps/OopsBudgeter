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

import { useMouse } from "@/hooks/usemouse";
import { cn } from "@/lib/utils";
import React from "react";

interface HoverEffectProps {
  circleSize?: number;
  className?: string;
  children: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  role?: string;
  isRounded?: boolean;
}

export default function HoverEffect({
  circleSize = 333,
  className,
  children,
  bgColor = "linear-gradient(135deg, #1c4dac, #1b8adf, #25a6ce, #30ba7c)",
  onClick,
  role,
  isRounded = false,
}: Readonly<HoverEffectProps>) {
  const [mouse, parentRef] = useMouse();

  return (
    <div
      className={cn(
        "group h-full w-full relative transform-gpu overflow-hidden rounded-lg p-5 transition-all duration-700 border border-primary/20 hover:border-primary/30 bg-background cursor-pointer",
        className
      )}
      onClick={onClick}
      ref={parentRef}
      role={role}
    >
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full transition-transform duration-700 group-hover:scale-[3] -z-10",
          mouse.elementX === null || mouse.elementY === null
            ? "opacity-0"
            : "opacity-100"
        )}
        style={{
          maskImage: `radial-gradient(${
            circleSize / 2
          }px circle at center, white, transparent)`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: `${mouse.elementX}px`,
          top: `${mouse.elementY}px`,
          background: bgColor,
        }}
      />
      <div
        className={cn(
          "absolute inset-px rounded-lg bg-background/80 -z-10",
          isRounded && "rounded-full"
        )}
      />
      {children}
    </div>
  );
}
