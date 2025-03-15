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
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { selectTransactionType } from "@/schema/transactionForm";

interface BudgetContextType {
  transactions: selectTransactionType[];
  filteredTransactions: selectTransactionType[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBalance: number;
  startDate: Date;
  endDate: Date;
  sortKey: "amount" | "date" | "id";
  sortOrder: "asc" | "desc";
  transactionTypeFilter: "all" | "income" | "expense";
  balanceMode: "total" | "timeframe";
  setDateRange: (start: Date, end: Date) => void;
  addTransaction: (newTransaction: selectTransactionType) => void;
  removeTransaction: (id: number) => void;
  sortTransactions: (key: "amount" | "date" | "id") => void;
  filterByType: (type: "all" | "income" | "expense") => void;
  toggleSortOrder: () => void;
  toggleBalanceMode: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<selectTransactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    selectTransactionType[]
  >([]);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [sortKey, setSortKey] = useState<"amount" | "date" | "id">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [balanceMode, setBalanceMode] = useState<"total" | "timeframe">(
    "total"
  );

  useEffect(() => {
    const savedMode = localStorage.getItem("balanceMode");
    if (savedMode === "total" || savedMode === "timeframe") {
      setBalanceMode(savedMode);
    }
  }, []);

  useEffect(() => {
    const getTransactions = async () => {
      const data = await fetchTransactions();
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setTransactions(sorted);
      filterTransactions(sorted, startDate, endDate, transactionTypeFilter);
    };

    getTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterTransactions = (
    data: selectTransactionType[],
    start: Date,
    end: Date,
    type: "all" | "income" | "expense"
  ) => {
    let filtered = data.filter((trx) =>
      isWithinInterval(parseISO(trx.date), { start, end })
    );

    if (type !== "all") {
      filtered = filtered.filter((trx) => trx.type === type);
    }

    setFilteredTransactions(filtered);
  };

  const filterByType = (type: "all" | "income" | "expense") => {
    setTransactionTypeFilter(type);
    filterTransactions(transactions, startDate, endDate, type);
  };

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    filterTransactions(transactions, start, end, transactionTypeFilter);
  };

  const sortTransactions = (key: "amount" | "date" | "id") => {
    let newSortOrder: "asc" | "desc" = "asc";

    if (sortKey === key) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortKey(key);
    setSortOrder(newSortOrder);

    const sorted = [...filteredTransactions].sort((a, b) => {
      if (key === "amount") {
        return newSortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (key === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (key === "id") {
        return newSortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });

    setFilteredTransactions(sorted);
  };

  const toggleBalanceMode = () => {
    setBalanceMode((prev) => {
      const newMode = prev === "total" ? "timeframe" : "total";
      localStorage.setItem("balanceMode", newMode);
      return newMode;
    });
  };

  const addTransaction = (newTransaction: selectTransactionType) => {
    setTransactions((prev) => {
      const updatedTransactions = [newTransaction, ...prev];
      return sortKey === "id" && sortOrder === "desc"
        ? updatedTransactions
        : [...updatedTransactions].sort((a, b) => a.id - b.id);
    });

    setFilteredTransactions((prev) => {
      const transactionDate = parseISO(newTransaction.date);
      const isWithinTimeframe =
        transactionDate >= startDate && transactionDate <= endDate;
      if (balanceMode === "total" || isWithinTimeframe) {
        const updatedFiltered = [newTransaction, ...prev];
        return sortKey === "id" && sortOrder === "desc"
          ? updatedFiltered
          : [...updatedFiltered].sort((a, b) => a.id - b.id);
      }
      return prev;
    });
  };

  const removeTransaction = (id: number) => {
    setTransactions((prev) => {
      const updatedTransactions = prev.filter((trx) => trx.id !== id);
      return sortKey === "id" && sortOrder === "desc"
        ? updatedTransactions
        : [...updatedTransactions].sort((a, b) => a.id - b.id);
    });

    setFilteredTransactions((prev) => {
      const updatedFiltered = prev.filter((trx) => trx.id !== id);
      return sortKey === "id" && sortOrder === "desc"
        ? updatedFiltered
        : [...updatedFiltered].sort((a, b) => a.id - b.id);
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setFilteredTransactions([...filteredTransactions].reverse());
  };

  const totalIncome = filteredTransactions
    .filter((trx) => trx.type === "income")
    .reduce((sum, trx) => sum + trx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((trx) => trx.type === "expense")
    .reduce((sum, trx) => sum + trx.amount, 0);

  const totalPersistentIncome = transactions
    .filter((trx) => trx.type === "income")
    .reduce((sum, trx) => sum + trx.amount, 0);

  const totalPersistentExpense = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((sum, trx) => sum + trx.amount, 0);

  const balance = totalIncome - totalExpense;

  const totalBalance = totalPersistentIncome - totalPersistentExpense;

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        filteredTransactions,
        totalIncome,
        totalExpense,
        balance,
        totalBalance,
        startDate,
        endDate,
        setDateRange,
        addTransaction,
        sortKey,
        sortOrder,
        sortTransactions,
        toggleSortOrder,
        filterByType,
        transactionTypeFilter,
        removeTransaction,
        balanceMode,
        toggleBalanceMode,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
