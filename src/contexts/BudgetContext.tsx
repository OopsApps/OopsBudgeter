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

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchTransactions } from "@/lib/api";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { selectTransactionType } from "@/schema/transactionForm";
import {
  achievements,
  checkUnlockedAchievements,
} from "@/constants/achievements";
import { toast } from "sonner";
import { useApp } from "./AppContext";

interface BudgetContextType {
  transactions: selectTransactionType[];
  filteredTransactions: selectTransactionType[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBalance: number;
  startDate: Date;
  endDate: Date;
  sortKey: "amount" | "date" | "id" | "recurring";
  sortOrder: "asc" | "desc";
  transactionTypeFilter: "all" | "income" | "expense";
  balanceMode: "total" | "timeframe";
  currency: string;
  updateCurrency: (newCurrency: string) => void;
  setDateRange: (start: Date, end: Date) => void;
  addTransaction: (newTransaction: selectTransactionType) => void;
  removeTransaction: (id: number) => void;
  sortTransactions: (key: "amount" | "date" | "id" | "recurring") => void;
  filterByType: (type: "all" | "income" | "expense") => void;
  toggleSortOrder: () => void;
  toggleBalanceMode: () => void;
  updateTransactionStatus: (id: number, newStatus: string) => void;
  updateTransaction: (updatedTransaction: selectTransactionType) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<selectTransactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    selectTransactionType[]
  >([]);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [sortKey, setSortKey] = useState<
    "amount" | "date" | "id" | "recurring"
  >("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [balanceMode, setBalanceMode] = useState<"total" | "timeframe">(
    "total"
  );
  const [currency, setCurrency] = useState("USD");
  const prevUnlocked = useRef<{ [key: string]: boolean }>({});
  const { soundEffects } = useApp();

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

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");

    if (savedCurrency) {
      setCurrency(savedCurrency);
    } else {
      const envCurrency = process.env.NEXT_PUBLIC_CURRENCY;
      if (envCurrency) {
        setCurrency(envCurrency);
      }
    }
  }, []);

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const filterTransactions = (
    data: selectTransactionType[],
    start: Date,
    end: Date,
    type: "all" | "income" | "expense"
  ) => {
    let filtered: selectTransactionType[] = [];

    filtered = data.filter((trx) => {
      const isRecurringMatch =
        sortKey === "recurring" ? trx.is_recurring : !trx.is_recurring;
      return (
        isRecurringMatch && isWithinInterval(parseISO(trx.date), { start, end })
      );
    });

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

  const sortTransactions = (key: "amount" | "date" | "id" | "recurring") => {
    let newSortOrder: "asc" | "desc" = "asc";

    if (sortKey === key) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortKey(key);
    setSortOrder(newSortOrder);

    let sorted;

    if (key === "recurring") {
      sorted = transactions.filter((trx) => trx.is_recurring === true);
    } else {
      sorted = [...transactions].filter((trx) => {
        const trxDate = new Date(trx.date);
        return trxDate >= startDate && trxDate <= endDate && !trx.is_recurring;
      });
    }

    sorted.sort((a, b) => {
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

  const addTransaction = async (newTransaction: selectTransactionType) => {
    setTransactions((prev) => {
      const updatedTransactions = [newTransaction, ...prev];
      return sortKey === "id" && sortOrder === "desc"
        ? updatedTransactions
        : [...updatedTransactions].sort((a, b) => a.id - b.id);
    });

    if (sortKey === "recurring" && newTransaction.is_recurring) {
      setFilteredTransactions((prev) => {
        const transactionDate = parseISO(newTransaction.date);
        const isWithinTimeframe =
          transactionDate >= startDate && transactionDate <= endDate;

        if (!isWithinTimeframe) return prev;

        const updatedFiltered = [newTransaction, ...prev];
        return sortOrder === "desc"
          ? updatedFiltered
          : [...updatedFiltered].sort((a, b) => a.id - b.id);
      });
    }

    const unlockedNow = checkUnlockedAchievements([
      ...transactions,
      newTransaction,
    ]);

    const response = await fetch("/api/achievements");
    const unlockedFromDB = await response.json();
    const unlockedIds = Array.isArray(unlockedFromDB)
      ? unlockedFromDB.map(
          (a: { id?: string }) => a.id?.toString?.() ?? a.toString()
        )
      : [];

    const newlyUnlocked = Object.entries(unlockedNow).filter(
      ([id, unlocked]) => unlocked && !unlockedIds.includes(id)
    );

    if (newlyUnlocked.length > 0) {
      for (const [id] of newlyUnlocked) {
        const achievement = achievements.find((a) => a.id === id);
        if (!achievement) continue;

        try {
          await fetch("/api/achievements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              title: achievement.title,
              description: achievement.description,
            }),
          });
        } catch (e) {
          console.error("Failed to save achievement:", id, e);
        }

        toast.success(`🎉 Unlocked: ${achievement.title}`);
        if (soundEffects === "On") {
          const audio = new Audio("/audio/yay.mp3");
          audio.volume = 0.1;
          audio.play().catch((e) => console.error("Sound error:", e));
        }
      }
    }

    prevUnlocked.current = unlockedNow;

    setFilteredTransactions((prev) => {
      const transactionDate = parseISO(newTransaction.date);
      const isWithinTimeframe =
        transactionDate >= startDate && transactionDate <= endDate;

      const isRecurringMatch =
        sortKey === "recurring"
          ? newTransaction.is_recurring
          : !newTransaction.is_recurring;

      if (!isWithinTimeframe || !isRecurringMatch) {
        return prev;
      }

      const updatedFiltered = [newTransaction, ...prev];
      return sortKey === "id" && sortOrder === "desc"
        ? updatedFiltered
        : [...updatedFiltered].sort((a, b) => a.id - b.id);
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

  const updateTransactionStatus = (id: number, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((trx) => (trx.id === id ? { ...trx, status: newStatus } : trx))
    );

    setFilteredTransactions((prev) =>
      prev.map((trx) => (trx.id === id ? { ...trx, status: newStatus } : trx))
    );
  };

  const updateTransaction = (updatedTransaction: selectTransactionType) => {
    setTransactions((prev) =>
      prev.map((trx) =>
        trx.id === updatedTransaction.id ? updatedTransaction : trx
      )
    );

    setFilteredTransactions((prev) =>
      prev.map((trx) =>
        trx.id === updatedTransaction.id ? updatedTransaction : trx
      )
    );
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
        currency,
        updateCurrency,
        updateTransactionStatus,
        updateTransaction,
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
