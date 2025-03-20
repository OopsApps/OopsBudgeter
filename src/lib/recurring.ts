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

import { db } from "@/lib/db";
import cron from "node-cron";
import { transactions } from "@/schema/dbSchema";
import { eq, and, desc } from "drizzle-orm";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";

const isServerless = process.env.VERCEL === "1";

const getNextDueDate = (lastGeneratedDate: Date, frequency: string): Date => {
  switch (frequency) {
    case "daily":
      return addDays(lastGeneratedDate, 1);
    case "weekly":
      return addWeeks(lastGeneratedDate, 1);
    case "monthly":
      return addMonths(lastGeneratedDate, 1);
    case "yearly":
      return addYears(lastGeneratedDate, 1);
    default:
      throw new Error("Invalid frequency type");
  }
};

export const processRecurringTransactions = async () => {
  const today = new Date();

  const recurringTrxs = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.is_recurring, true),
        eq(transactions.status, "active")
      )
    );

  for (const trx of recurringTrxs) {
    const lastGenerated = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.description, trx.description ?? ""),
          eq(transactions.amount, trx.amount),
          eq(transactions.category, trx.category ?? ""),
          eq(transactions.is_recurring, false)
        )
      )
      .orderBy(desc(transactions.date))
      .limit(1);

    const lastTransactionDate = lastGenerated.length
      ? new Date(lastGenerated[0].date)
      : new Date(trx.date);

    let nextDueDate = getNextDueDate(lastTransactionDate, trx.frequency);

    while (nextDueDate <= today) {
      await db.insert(transactions).values({
        type: trx.type,
        amount: trx.amount,
        description: trx.description,
        date: format(nextDueDate, "yyyy-MM-dd'T'HH:mm:ss"),
        category: trx.category,
        is_recurring: false,
      });

      nextDueDate = getNextDueDate(nextDueDate, trx.frequency);
    }
  }
};

if (!isServerless) {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running recurring transaction processor...");
    await processRecurringTransactions();
    console.log("Recurring transactions processed successfully!");
  });
}
