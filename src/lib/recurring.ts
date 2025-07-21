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
import { isNotNull } from "drizzle-orm";

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
  const templates = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.status, "active"),
        eq(transactions.is_recurring, true),
        isNotNull(transactions.frequency)
      )
    );

  const now = new Date();

  for (const template of templates) {
    const frequency = template.frequency!;
    const baseTime = new Date(template.date);
    const lastGenerated = await db
      .select()
      .from(transactions)
      .where(eq(transactions.recurring_parent_id, template.id))
      .orderBy(desc(transactions.date))
      .limit(1);

    const lastDate = lastGenerated.length
      ? new Date(lastGenerated[0].date)
      : baseTime;

    const dateCursor = new Date(lastDate);

    while (now >= dateCursor) {
      const alreadyExists = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.recurring_parent_id, template.id),
            eq(transactions.date, format(dateCursor, "yyyy-MM-dd'T'HH:mm:ss"))
          )
        )
        .limit(1);

      if (!alreadyExists.length) {
        await db.insert(transactions).values({
          type: template.type,
          amount: template.amount,
          original_amount: template.original_amount,
          original_currency: template.original_currency,
          description: template.description,
          date: format(dateCursor, "yyyy-MM-dd'T'HH:mm:ss"),
          category: template.category,
          is_actual: template.is_consistent_amount ?? false,
          recurring_parent_id: template.id,
          status: template.status,
          is_recurring: false,
          frequency: null,
        });
      }

      dateCursor.setTime(getNextDueDate(dateCursor, frequency).getTime());
    }
  }

  console.log("Recurring transactions up to date");
};

if (!isServerless) {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running recurring transaction processor...");
    try {
      await processRecurringTransactions();
      console.log("Recurring transactions processed successfully!");
    } catch (error) {
      console.error("Recurring transaction processor failed:", error);
    }
  });
}
