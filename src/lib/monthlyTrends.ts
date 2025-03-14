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
import { format } from "date-fns";

type MonthlyTrend = {
  name: string;
  income: number;
  expenses: number;
};

export const getMonthlyTrends = (
  transactions: selectTransactionType[]
): MonthlyTrend[] => {
  const monthlyData: Record<string, MonthlyTrend> = transactions.reduce(
    (acc, trx) => {
      if (!trx.date) return acc;

      const month: string = format(new Date(trx.date), "MMM yyyy");

      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expenses: 0 };
      }

      if (trx.type === "income") {
        acc[month].income += trx.amount;
      } else if (trx.type === "expense") {
        acc[month].expenses += trx.amount;
      }

      return acc;
    },
    {} as Record<string, MonthlyTrend>
  );

  return Object.values(monthlyData);
};
