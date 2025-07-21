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

import React from "react";
import { formatDate } from "@/lib/formateDate";
import { selectTransactionType } from "@/schema/transactionForm";
import TxCard from "../cards/TxCard";
import PriceDisplay from "../common/Currency";

import { categoryColors } from "@/constants/catColor";
import { useApp } from "@/contexts/AppContext";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import RecurringStatusDialog from "./RecurringStatusDialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Icon } from "@iconify/react/dist/iconify.js";
import { printReceipt } from "@/lib/download";
import { useBudget } from "@/contexts/BudgetContext";
import EditTransactionDialog from "./EditTransactionDialog";
import { AmountMismatchDialog } from "./InconsistencePrompt";

export default function SingleTransaction({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { currency, updateTransaction } = useBudget();
  const { colorfulCategories, colorfulTransactions } = useApp();

  const getCategoryColor = (category: string) => {
    const match = categoryColors.find((c) => c.category === category);
    if (category === "Other") return "#8D68D6";
    return match ? match.color : "#CCCCCC";
  };

  return (
    <TxCard
      bgColor={
        colorfulTransactions === "On"
          ? trx.type === "income"
            ? "#2DAC6420"
            : "#e2444420"
          : ""
      }
      className="p-0 bg-accent/40"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex p-4 flex-col md:flex-row gap-3 justify-between items-center select-none">
            <div className="flex flex-col gap-2">
              <span className="max-w-md break-words">
                {trx.category && trx.category !== "None" && (
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        colorfulCategories === "On"
                          ? getCategoryColor(trx.category)
                          : "",
                    }}
                  >
                    {trx.category}
                  </span>
                )}
                {trx.category &&
                  trx.category !== "None" &&
                  trx.description &&
                  " • "}
                {trx.description && trx.description}
              </span>
              <span className="text-muted-foreground flex items-center gap-2">
                {formatDate(trx.date)}
                {trx.is_recurring && (
                  <span className="hidden items-center md:flex">
                    <Icon
                      icon="fluent:arrow-repeat-all-24-filled"
                      style={{
                        color:
                          trx.status === "active"
                            ? "#3E70CC"
                            : trx.status === "paused"
                            ? "#DDBF3B"
                            : "#E46060",
                      }}
                    />
                  </span>
                )}
              </span>
            </div>
            <div className="font-bold flex items-center gap-2">
              <div
                className="flex items-center gap-1"
                style={{
                  color: trx.type === "income" ? "#2DAC64" : "#e24444",
                }}
              >
                {trx.type === "income" ? "+" : "-"}
                <PriceDisplay trx={trx} />
                {trx.is_recurring && (
                  <span className="flex items-center md:hidden">
                    <Icon
                      icon="fluent:arrow-repeat-all-24-filled"
                      style={{
                        color:
                          trx.status === "active"
                            ? "#3E70CC"
                            : trx.status === "paused"
                            ? "#DDBF3B"
                            : "#E46060",
                      }}
                    />
                  </span>
                )}

                {trx.is_actual === false && (
                  <AmountMismatchDialog
                    trxId={trx.id}
                    trxAmount={trx.amount}
                    onConfirm={(amt) =>
                      updateTransaction({
                        ...trx,
                        is_actual: true,
                        amount: amt,
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="select-none">
          <ContextMenuItem asChild>
            <EditTransactionDialog trx={trx} />
          </ContextMenuItem>
          {trx.is_recurring && (
            <>
              <div className="border my-1 border-accent" />
              <ContextMenuItem asChild>
                <RecurringStatusDialog trx={trx} />
              </ContextMenuItem>
            </>
          )}
          <div className="border my-1 border-accent" />
          <ContextMenuItem asChild>
            <div
              className="flex justify-between"
              onClick={() => printReceipt(trx, currency)}
            >
              Print Receipt
              <Icon
                icon="line-md:downloading-loop"
                className="min-w-5 min-h-5 text-purple-500"
              />
            </div>
          </ContextMenuItem>
          <div className="border my-1 border-accent" />
          <ContextMenuItem asChild>
            <DeleteTransactionDialog trx={trx} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TxCard>
  );
}
