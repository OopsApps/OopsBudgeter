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

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export default function PriceDisplay({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const { currency } = useBudget();
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const correctCurrency =
    currency.length !== 3 ? "USD" : currency.toUpperCase();

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
    <span className={className}>
      {formatCurrency(convertedAmount, correctCurrency)}
    </span>
  );
}
