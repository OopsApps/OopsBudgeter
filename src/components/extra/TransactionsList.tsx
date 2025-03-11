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

import React, { useEffect, useState } from "react";
import HoverEffect from "../effects/HoverEffect";
import { useBalance } from "@/contexts/BalanceContext";
import { Transaction } from "@/types/Transaction";
import SingleTransaction from "./Transaction";
import { Icon } from "@iconify/react";
import { printTransactions } from "@/lib/download";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currentBalance } = useBalance();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<"amount" | "date" | "">("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();

        if (data.transactions) {
          setTransactions(data.transactions); 
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [currentBalance]);

  const sortTransactions = () => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (sortKey === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    setTransactions(sortedTransactions);
  };

  useEffect(() => {
    sortTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, sortKey]);

  return (
    <HoverEffect bgColor="#3D3D3D">
      <div className="flex justify-between">
        <h2 className="font-semibold text-xl mb-4 border-b-2 border-primary/24">
          Transactions
        </h2>
        <div className="flex gap-2 bg-secondary rounded-lg items-center justify-center py-1 px-3 mb-2 group">
          <Icon
            icon="mdi:cash-multiple"
            style={{
              color: sortKey === "amount" ? "#fff" : "#3D3D3D",
            }}
            onClick={() => setSortKey("amount")}
            width={24}
          />
          <Icon
            icon="lets-icons:date-fill"
            style={{
              color: sortKey === "date" ? "#fff" : "#3D3D3D",
            }}
            onClick={() => setSortKey("date")}
            width={24}
          />
          <Icon
            icon={
              sortOrder === "asc"
                ? "gravity-ui:bars-ascending-align-left-arrow-up"
                : "gravity-ui:bars-descending-align-left-arrow-down"
            }
            className="transition-all ease-in-out text-[#5374aa] rounded-md"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            width={24}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {transactions.length > 0 ? (
          transactions.map((trx: Transaction) => {
            return <SingleTransaction key={trx.tid} trx={trx} />;
          })
        ) : (
          <span className="text-center py-7">No transactions found</span>
        )}
      </div>
      <div className="border-t-2 mt-4" />
      <div
        className="mt-4 flex justify-center items-center gap-4 cursor-pointer"
        onClick={() => printTransactions(transactions)}
      >
        Print all transactions
        <Icon
          icon="line-md:cloud-alt-print-twotone-loop"
          width={28}
          aria-valuetext="Print"
        />
      </div>
    </HoverEffect>
  );
}
