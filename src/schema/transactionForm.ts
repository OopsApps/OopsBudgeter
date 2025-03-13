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

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transactions } from "./dbSchema";
import { z } from "zod";

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: (schema) =>
    schema
      .min(0, "Amount must be greater than 0")
      .positive("Amount must be a positive number"),
  description: (schema) =>
    schema
      .max(
        100,
        "You have reached the maximum characters allowed for a description (100 characters)"
      )
      .optional(),
  date: () =>
    z.preprocess((val) => {
      if (typeof val === "string" && val.includes("T")) {
        return new Date(val);
      }
      return val;
    }, z.date().or(z.string().min(1, "Date is required"))),
});

export const selectTransactionSchema = createSelectSchema(transactions);

export type insertTransactionType = typeof insertTransactionSchema._type;

export type selectTransactionType = typeof selectTransactionSchema._type;
