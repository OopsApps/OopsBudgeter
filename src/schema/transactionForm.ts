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

import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Transaction type is required" }),
  }),
  amount: z
    .number()
    .min(0, { message: "Amount must be greater than 0" })
    .positive({ message: "Amount must be a positive number" }),
  description: z
    .string()
    .max(500, { message: "Amount must be greater than 0" })
    .optional(),
  date: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }),
});
