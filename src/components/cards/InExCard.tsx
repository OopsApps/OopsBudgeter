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

import React, { useEffect, useState } from "react";
import HoverEffect from "../effects/HoverEffect";
import PriceDisplay from "../common/Currency";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface InExCardProps {
  title: "Expenses" | "Income";
  amount: number;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

export default function InExCard({
  amount,
  title,
  onClick,
  className,
  iconClassName,
}: Readonly<InExCardProps>) {
  const [animateText, setAnimateText] = useState(false);
  useEffect(() => {
    setAnimateText(true);
    setTimeout(() => setAnimateText(false), 500);
  }, [amount]);

  return (
    <HoverEffect
      className={cn("p-2", className)}
      bgColor={
        title === "Expenses"
          ? "linear-gradient(135deg, #8b1c1c, #e24444, #d34f1b)"
          : "linear-gradient(135deg, #166d3b, #1ba94c, #6dd400)"
      }
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center font-semibold text-foreground border-l-8 rounded-l-md",
          title === "Expenses" ? "border-[#e24444]" : "border-[#166d3b]"
        )}
      >
        <h2 className="flex gap-1 items-center">
          {title}
          <Icon
            onClick={onClick}
            icon="line-md:filter"
            className={iconClassName}
          />
        </h2>
        <span
          className={cn(
            "transition-all duration-300",
            animateText
              ? "opacity-0 translate-y-7"
              : "opacity-100 translate-y-0"
          )}
        >
          <PriceDisplay trx={{ amount }} />
        </span>
      </div>
    </HoverEffect>
  );
}
