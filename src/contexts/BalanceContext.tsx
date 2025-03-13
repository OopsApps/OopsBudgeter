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

import { selectTransactionType } from "@/schema/transactionForm";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface BalanceContextType {
  currentBalance: number;
  setCurrentBalance: (balance: number) => void;
  loading?: boolean;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      const balance = data.transactions.reduce(
        (acc: number, transaction: selectTransactionType) => {
          return transaction.type === "income"
            ? acc + transaction.amount
            : acc - transaction.amount;
        },
        0
      );
      setCurrentBalance(balance);
    } catch (error) {
      console.error("Error fetching transactions", error);
      setCurrentBalance(0);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const refreshBalance = async () => {
    await fetchTransactions();
  };

  return (
    <BalanceContext.Provider
      value={{ currentBalance, setCurrentBalance, refreshBalance }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
