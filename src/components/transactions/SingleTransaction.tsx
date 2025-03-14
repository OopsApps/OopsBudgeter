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

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { formatDate } from "@/lib/formateDate";
import { selectTransactionType } from "@/schema/transactionForm";
import TxCard from "../cards/TxCard";
import PriceDisplay from "../common/Currency";
import { useBudget } from "@/contexts/BudgetContext";
import { toast } from "sonner";
import {
  AlertDialogAction,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function SingleTransaction({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { removeTransaction } = useBudget();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async (id: number): Promise<void> => {
    setConfirmOpen(false);

    const response = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.ok) {
      removeTransaction(id);
      toast.success("The transaction has been deleted successfully");
      const audio = new Audio("/audio/delete.wav");
      audio.volume = 0.4;
      audio.play();
    } else {
      console.error(`Error: ${data.message}`);
    }
  };
  return (
    <TxCard
      bgColor={trx.type === "income" ? "#2DAC6420" : "#e2444420"}
      className="p-3 "
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="max-w-56 sm:max-w-md break-words">
            {trx.category && trx.category !== "None" && trx.category}
            {trx.category &&
              trx.category !== "None" &&
              trx.description &&
              " ‣ "}
            {trx.description && trx.description}
          </span>
          <span className="text-muted-foreground">{formatDate(trx.date)}</span>
        </div>
        <span
          className="font-bold flex items-center gap-2"
          style={{
            color: trx.type === "income" ? "#2DAC64" : "#e24444",
          }}
        >
          <PriceDisplay amount={trx.amount} />

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Icon
                icon="mdi:trash-can-empty"
                width={22}
                className="hover:text-white text-red-400 transition-colors duration-300 cursor-pointer"
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this transaction of{" "}
                  <PriceDisplay
                    amount={trx.amount}
                    className={cn(
                      "inline-flex font-semibold",
                      trx.type === "income"
                        ? "text-[#42cf7f]"
                        : "text-[#e24444]"
                    )}
                  />{" "}
                  made on{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {formatDate(trx.date)}
                  </span>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDelete(trx.id)}
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </span>
      </div>
    </TxCard>
  );
}
