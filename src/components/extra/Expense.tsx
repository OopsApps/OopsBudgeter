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

import InExCard from "../cards/InExCard";
import { useBudget } from "@/contexts/BudgetContext";

export default function Expense() {
  const { totalExpense, transactionTypeFilter, filterByType } = useBudget();

  return (
    <InExCard
      title="Expenses"
      amount={totalExpense}
      onClick={() =>
        filterByType(transactionTypeFilter === "expense" ? "all" : "expense")
      }
      className={`${transactionTypeFilter === "expense" && "bg-red-500"}`}
      iconClassName={`${
        transactionTypeFilter === "expense" && "text-[#e24444]"
      }`}
    />
  );
}
