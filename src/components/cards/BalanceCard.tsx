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
import PriceDisplay from "../common/Currency";
import { useBudget } from "@/contexts/BudgetContext";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function BalanceCard() {
  const { balance, totalBalance, balanceMode, toggleBalanceMode } = useBudget();
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    setAnimateText(true);
    setTimeout(() => setAnimateText(false), 500);
  }, [balance, totalBalance]);

  const handleMode = () => {
    setAnimateText(true);
    setTimeout(() => setAnimateText(false), 500);
    toggleBalanceMode();
  };

  return (
    <HoverEffect className="p-2">
      <div className="flex flex-col items-center justify-center font-semibold text-foreground">
        <h2
          className={`flex gap-1 items-center transition-all duration-300 ${
            animateText
              ? "opacity-0 -translate-y-6"
              : "opacity-100 translate-y-0"
          }`}
        >
          {balanceMode === "total" ? "Total Balance" : "Timeframe Balance"}
          <Icon
            onClick={() => handleMode()}
            icon="line-md:filter"
            className={`${balanceMode !== "total" && "text-[#1e8fc9]"}`}
          />
        </h2>
        <span
          className={`transition-all duration-300 ${
            animateText
              ? "opacity-0 translate-y-6"
              : "opacity-100 translate-y-0"
          }`}
        >
          <PriceDisplay
            trx={{
              amount: balanceMode === "total" ? totalBalance : balance,
            }}
          />
        </span>
      </div>
    </HoverEffect>
  );
}
