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

import { useBudget } from "@/contexts/BudgetContext";
import { format } from "date-fns";
import HoverEffect from "../effects/HoverEffect";

export default function DateRangePicker() {
  const { startDate, endDate, setDateRange } = useBudget();

  return (
    <HoverEffect
      bgColor="#584A33"
      className="flex gap-4 items-center justify-between"
    >
      <input
        type="date"
        value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          const newDate = e.target.value
            ? new Date(e.target.value)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          setDateRange(newDate, endDate);
        }}
        className="border p-2 rounded-md text-base"
      />
      <span className="text-base font-semibold items-center gap-2 hidden md:flex">
        {format(startDate, "MMM d")}
        <p>-</p>
        {format(endDate, "MMM d")}
      </span>
      <p className="flex md:hidden">-</p>
      <input
        type="date"
        value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          const newDate = e.target.value
            ? new Date(e.target.value)
            : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
          setDateRange(startDate, newDate);
        }}
        className="border p-2 rounded-md text-base"
      />
    </HoverEffect>
  );
}
