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

import {
  pgTable,
  serial,
  text,
  timestamp,
  real,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const TypeEnum = pgEnum("TransactionType", ["income", "expense"]);

export const IncomeCategories = pgEnum("IncomeCategories", [
  "Salary",
  "Freelance",
  "Investment",
  "Bonus",
  "Other",
]);

export const ExpenseCategories = pgEnum("ExpenseCategories", [
  "Food",
  "Rent",
  "Utilities",
  "Transport",
  "Entertainment",
  "Shopping",
  "Other",
]);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: TypeEnum("type"),
  amount: real("amount").notNull(),
  description: text("description"),
  date: timestamp("date", { mode: "string" }).notNull(),
  category: text("category"),

  is_recurring: boolean("is_recurring").default(false).notNull(),
  frequency: text("frequency").default("monthly").notNull(),
  status: text("status").default("active").notNull(),
});
