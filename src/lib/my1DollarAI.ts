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

import { formatCurrency } from "@/components/common/Currency";
import { selectTransactionType } from "@/schema/transactionForm";
import { format } from "date-fns";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export const getSpendingInsights = (transactions: selectTransactionType[]) => {
  if (!transactions.length) return "No transactions recorded yet.";

  const categories = transactions.reduce<Record<string, number>>((acc, trx) => {
    if (trx.type === "expense") {
      acc[trx.category ?? "None"] =
        (acc[trx.category ?? "None"] || 0) + trx.amount;
    }
    return acc;
  }, {});

  const sortedCategories = Object.entries(categories).sort(
    (a, b) => b[1] - a[1]
  );
  const topCategory = sortedCategories.length
    ? sortedCategories[0]
    : ["None", 0];
  const totalSpent = sortedCategories.reduce(
    (sum, [, value]) => sum + value,
    0
  );

  return `Your highest spending category this month is ${
    topCategory[0]
  } with ${formatCurrency(
    Number(Number(topCategory[1]).toFixed(2)),
    currencyCode
  )} spent. 
  You spent a total of ${formatCurrency(
    Number(totalSpent.toFixed(2)),
    currencyCode
  )} this month.`;
};

export const predictNextMonthSpending = (
  transactions: selectTransactionType[]
) => {
  const monthlyTotals = transactions.reduce<Record<string, number>>(
    (acc, trx) => {
      if (trx.type === "expense") {
        const month = format(new Date(trx.date), "yyyy-MM");
        acc[month] = (acc[month] || 0) + trx.amount;
      }
      return acc;
    },
    {}
  );

  const lastMonths = Object.values(monthlyTotals).slice(-3);
  const avgSpending = lastMonths.length
    ? lastMonths.reduce((a, b) => a + b, 0) / lastMonths.length
    : 0;
  const projected = avgSpending * 1.05;

  return `Based on recent trends, your predicted spending for next month is ${formatCurrency(
    Number(projected.toFixed(2)),
    currencyCode
  )}.`;
};

export const getNoSpendStreak = (transactions: selectTransactionType[]) => {
  const sortedTransactions = [...transactions]
    .filter((trx) => trx.type === "expense")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let prevDate = new Date();

  for (const trx of sortedTransactions) {
    const trxDate = new Date(trx.date);
    const diff =
      (prevDate.getTime() - trxDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 1) break;
    streak++;
    prevDate = trxDate;
  }

  return `🔥 You have a ${streak}-day no-spend streak!`;
};
