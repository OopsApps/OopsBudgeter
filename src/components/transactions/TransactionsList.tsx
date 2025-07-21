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

import React from "react";
import HoverEffect from "../effects/HoverEffect";
import SingleTransaction from "./SingleTransaction";
import { Icon } from "@iconify/react";
import {
  downloadJSON,
  exportTransactions,
  printTransactions,
} from "@/lib/download";
import { selectTransactionType } from "@/schema/transactionForm";
import { useBudget } from "@/contexts/BudgetContext";
import SortButtons from "../sorting/SortButtons";
import { useRouter } from "next/navigation";

export default function TransactionsList() {
  const { filteredTransactions, currency } = useBudget();
  const router = useRouter();

  return (
    <HoverEffect bgColor="#3D3D3D" className="cursor-default">
      <div className="flex justify-between flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-base md:text-xl border-b-2 border-primary/24">
            Transactions
          </h2>
          <div
            onClick={() => router.push("/analytics")}
            className="flex items-center gap-1 group/btn text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <h2 className="font-semibold text-sm md:text-base">
              View Analytics
            </h2>
            <Icon
              icon="icon-park-twotone:chart-line-area"
              width={22}
              className="cursor-pointer"
            />
          </div>
        </div>
        <SortButtons />
      </div>
      <div className="flex flex-col gap-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trx: selectTransactionType) => {
            return <SingleTransaction key={trx.id} trx={trx} />;
          })
        ) : (
          <span className="text-center py-12">No transactions found</span>
        )}
      </div>
      <div className="border-t-2 mt-4" />
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-accent hover:bg-blue-500 transition-colors duration-300 p-2 rounded-md"
          onClick={() => printTransactions(filteredTransactions, currency)}
        >
          Print PDF
          <Icon
            icon="ix:pdf-document-filled"
            width={23}
            aria-valuetext="Print"
          />
        </div>
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-accent hover:bg-blue-500 transition-colors duration-300 p-2 rounded-md"
          onClick={() => exportTransactions(filteredTransactions)}
        >
          Export CSV
          <Icon icon="ix:simulation-table" width={20} aria-valuetext="Print" />
        </div>
        <div
          className="flex w-full gap-2 items-center justify-center cursor-pointer bg-accent hover:bg-blue-500 transition-colors duration-300 p-2 rounded-md"
          onClick={() => downloadJSON(filteredTransactions, currency)}
        >
          Export JSON
          <Icon
            icon="ix:json-document-filled"
            width={23}
            aria-valuetext="Print"
          />
        </div>
      </div>
    </HoverEffect>
  );
}
