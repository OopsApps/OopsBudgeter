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
  amount: () =>
    z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() !== ""
          ? Number(val)
          : typeof val === "number"
          ? val
          : undefined,
      z
        .number({
          required_error: "Amount is required",
          invalid_type_error: "Amount must be a number",
        })
        .min(0.01, "Amount must be greater than 0")
        .positive("Amount must be a positive number")
        .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val.toString()), {
          message: "Amount must be a valid decimal number (up to 2 decimals)",
        })
    ),
  description: (schema) =>
    schema
      .max(
        100,
        "You have reached the maximum characters allowed for a description (100 characters)"
      )
      .optional(),
  date: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({
        required_error: "Date is required",
        invalid_type_error: "Invalid date format",
      })
    ),
  is_actual: (schema) => schema.default(true),
  frequency: () => z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  is_consistent_amount: () => z.boolean().optional(),
});

export const selectTransactionSchema = createSelectSchema(transactions);

export type insertTransactionType = z.infer<typeof insertTransactionSchema>;
export type selectTransactionType = z.infer<typeof selectTransactionSchema>;
