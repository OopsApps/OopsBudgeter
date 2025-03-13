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

import { createContext, useContext, useEffect, useState } from "react";
import { fetchTransactions } from "@/lib/api";
import { selectTransactionType } from "@/schema/transactionForm";

interface TransactionsContextType {
  transactions: selectTransactionType[];
  filteredTransactions: selectTransactionType[];
  setTransactions: (transactions: selectTransactionType[]) => void;
  filterTransactions: (type: "income" | "expense" | "all") => void;
  selectedFilter: "income" | "expense" | "all";
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<selectTransactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    selectTransactionType[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "income" | "expense" | "all"
  >("all");

  useEffect(() => {
    const getTransactions = async () => {
      const data = await fetchTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    };

    getTransactions();
  }, []);

  const filterTransactions = (type: "income" | "expense" | "all") => {
    if (selectedFilter === type) {
      setFilteredTransactions(transactions);
      setSelectedFilter("all");
    } else {
      setFilteredTransactions(transactions.filter((trx) => trx.type === type));
      setSelectedFilter(type);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        filteredTransactions,
        setTransactions,
        filterTransactions,
        selectedFilter,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
};
