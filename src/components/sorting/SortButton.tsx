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

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface SortButtonProps {
  sId?: string;
  sortKey?: string;
  icon: string;
  onClick: () => void;
  popTitle?: string;
  className?: string;
}

export default function SortButton({
  sId,
  sortKey,
  icon,
  onClick,
  popTitle,
  className,
}: Readonly<SortButtonProps>) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              onClick();
              handleClick();
            }}
            className={cn(
              "p-2 rounded-md flex gap-1 min-h-9 min-w-9 transition-transform duration-150 cursor-pointer",
              clicked ? "scale-90" : "scale-100",
              className,
              sortKey === sId
                ? "text-primary bg-background"
                : "text-muted-foreground/25"
            )}
          >
            <Icon icon={icon} width={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{popTitle}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
