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

import { useBudget } from "@/contexts/BudgetContext";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  trx: {
    amount: number;
    currency?: string | null;
    original_amount?: number | null;
    original_currency?: string | null;
  };
  className?: string;
}

export const fetchExchangeRates = async (baseCurrency: string) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    const data = await response.json();
    return data.rates || {};
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return {};
  }
};

export const formatCurrency = (amount?: number, currency?: string) => {
  if (amount === undefined || currency === undefined) {
    return "";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export default function PriceDisplay({ trx, className }: PriceDisplayProps) {
  const { currency: budgetCurrency } = useBudget();
  const { amount, currency, original_amount, original_currency } = trx;
  const { showOriginalAmount } = useApp();

  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const correctCurrency =
    (currency && currency.length === 3
      ? currency.toUpperCase()
      : budgetCurrency.length === 3
      ? budgetCurrency.toUpperCase()
      : "USD") || "USD";

  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchExchangeRates("USD");
      setExchangeRates(rates);
    };

    fetchRates();
  }, []);

  useEffect(() => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return;
    }

    if (exchangeRates[correctCurrency]) {
      const baseRate = exchangeRates["USD"] || 1;
      const targetRate = exchangeRates[correctCurrency] || 1;

      if (!baseRate || !targetRate) {
        setConvertedAmount(amount);
        return;
      }

      setConvertedAmount((amount / baseRate) * targetRate);
    } else {
      setConvertedAmount(amount);
    }
  }, [currency, exchangeRates, amount, correctCurrency]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "flex flex-col justify-between items-center",
              className
            )}
          >
            {showOriginalAmount === "On" &&
            typeof original_amount === "number" &&
            typeof original_currency === "string" ? (
              <>{formatCurrency(original_amount, original_currency)}</>
            ) : (
              <>{formatCurrency(convertedAmount, correctCurrency)}</>
            )}
          </span>
        </TooltipTrigger>

        {showOriginalAmount === "Off" &&
          typeof original_amount === "number" &&
          typeof original_currency === "string" && (
            <TooltipContent className="font-semibold text-sm" side="top">
              Original: {original_amount} {original_currency}
            </TooltipContent>
          )}
      </Tooltip>
    </TooltipProvider>
  );
}
