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

import { selectTransactionType } from "@/schema/transactionForm";

export const achievements = [
  {
    id: "first-transaction",
    title: "First Transaction",
    description: "Add your very first transaction.",
  },
  {
    id: "ten-transactions",
    title: "Getting Serious",
    description: "Add 10 transactions.",
  },
  {
    id: "hundred-transactions",
    title: "Accountant",
    description: "Add 100 transactions.",
  },
  {
    id: "first-income",
    title: "Cha-Ching!",
    description: "Add your first income transaction.",
  },
  {
    id: "first-expense",
    title: "First Bill",
    description: "Add your first expense transaction.",
  },
  {
    id: "five-categories",
    title: "Organizer",
    description: "Use 5 unique categories.",
  },
  {
    id: "large-expense",
    title: "Big Spender",
    description: "Add an expense over $1,000.",
  },
  {
    id: "tiny-expense",
    title: "Tiny Drip",
    description: "Add an expense under $1.",
  },
  {
    id: "recurring-setup",
    title: "Routine Master",
    description: "Create a recurring transaction.",
  },
  {
    id: "foreign-currency",
    title: "Currency Mixer",
    description: "Add a transaction in a non-default currency.",
  },
  {
    id: "week-streak",
    title: "Consistent Logger",
    description: "Add a transaction every day for 7 days.",
  },
  {
    id: "day-spree",
    title: "Spree!",
    description: "Add 5 transactions in a single day.",
  },
  {
    id: "weekend-transaction",
    title: "Weekend Warrior",
    description: "Add a transaction on a weekend.",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Add a transaction between 12am and 5am.",
  },
  {
    id: "multi-currency",
    title: "World Trader",
    description: "Use 3 different currencies.",
  },
];

export function checkUnlockedAchievements(
  transactions: selectTransactionType[]
) {
  const unlocked: Record<string, boolean> = {};

  const categorySet = new Set<string>();
  const currencySet = new Set<string>();
  const dates = new Map<string, number>();
  let dailyStreak = 0;
  let lastDate = "";

  transactions.forEach((trx) => {
    if (trx.category) categorySet.add(trx.category);

    if (trx.original_currency) currencySet.add(trx.original_currency);

    const date = trx.date.split("T")[0];
    dates.set(date, (dates.get(date) || 0) + 1);
  });

  const sortedDates = [...dates.keys()].sort();
  for (let i = 0; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const expected = lastDate ? new Date(lastDate) : null;
    if (expected) expected.setDate(expected.getDate() + 1);
    if (!lastDate || current.toDateString() === expected?.toDateString()) {
      dailyStreak++;
    } else {
      dailyStreak = 1;
    }
    lastDate = sortedDates[i];
  }

  unlocked["first-transaction"] = transactions.length >= 1;
  unlocked["ten-transactions"] = transactions.length >= 10;
  unlocked["hundred-transactions"] = transactions.length >= 100;

  unlocked["first-income"] = transactions.some((t) => t.type === "income");
  unlocked["first-expense"] = transactions.some((t) => t.type === "expense");
  unlocked["five-categories"] = categorySet.size >= 5;

  unlocked["large-expense"] = transactions.some(
    (t) => t.amount > 1000 && t.type === "expense"
  );
  unlocked["tiny-expense"] = transactions.some(
    (t) => t.amount > 0 && t.amount < 1 && t.type === "expense"
  );

  unlocked["recurring-setup"] = transactions.some(
    (t) => t.is_recurring === true
  );
  unlocked["foreign-currency"] = transactions.some(
    (t) => !!t.original_currency
  );
  unlocked["multi-currency"] = currencySet.size >= 3;

  unlocked["week-streak"] = dailyStreak >= 7;
  unlocked["day-spree"] = [...dates.values()].some((count) => count >= 5);

  unlocked["weekend-transaction"] = transactions.some((t) => {
    const day = new Date(t.date).getDay();
    return day === 0 || day === 6;
  });

  unlocked["night-owl"] = transactions.some((t) => {
    const hour = new Date(t.date).getHours();
    return hour >= 0 && hour <= 5;
  });

  return unlocked;
}
