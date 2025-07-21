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

import { useBudget } from "@/contexts/BudgetContext";
import { Icon } from "@iconify/react";
import React from "react";
import SortButton from "./SortButton";

export default function SortButtons() {
  const { sortTransactions, sortKey, sortOrder, toggleSortOrder } = useBudget();

  return (
    <div className="flex gap-2 bg-secondary rounded-lg items-center justify-between py-1 px-3 mb-2 group transition-all ease-linear duration-500">
      <span className="flex gap-1 items-center">
        <Icon
          onClick={() => toggleSortOrder()}
          icon="mdi:filter"
          width={20}
          className="transition-all"
        />
        :
      </span>

      <div className="flex gap-2">
        <SortButton
          sId="id"
          sortKey={sortKey}
          icon="mdi:recent"
          onClick={() => sortTransactions("id")}
          popTitle="Sort by Recent Transactions"
        />
        <SortButton
          sId="amount"
          sortKey={sortKey}
          icon="mdi:cash-multiple"
          onClick={() => sortTransactions("amount")}
          popTitle="Sort by Amount"
        />
        <SortButton
          sId="date"
          sortKey={sortKey}
          icon="line-md:calendar"
          onClick={() => sortTransactions("date")}
          popTitle="Sort by Date"
        />
        <SortButton
          sId="recurring"
          sortKey={sortKey}
          icon="fluent:calendar-arrow-repeat-all-16-filled"
          onClick={() => sortTransactions("recurring")}
          popTitle="View Recurring Transactions"
        />
      </div>

      <SortButton
        icon={
          sortOrder === "asc"
            ? "tabler:sort-ascending"
            : "tabler:sort-descending"
        }
        className="text-green-500 transition-all"
        onClick={() => toggleSortOrder()}
        popTitle={
          sortOrder === "asc" ? "Sort by Ascending" : "Sort by Descending"
        }
      />
    </div>
  );
}
