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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Icon } from "@iconify/react";
import { selectTransactionType } from "@/schema/transactionForm";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useBudget } from "@/contexts/BudgetContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { expenseCategories, incomeCategories } from "@/lib/categories";

export default function EditTransactionDialog({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { updateTransaction } = useBudget();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(trx.amount);
  const [description, setDescription] = useState(trx.description);
  const [category, setCategory] = useState(trx.category);
  const [isRecurring, setIsRecurring] = useState(trx.is_recurring);
  const [frequency, setFrequency] = useState(trx.frequency);

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: trx.id,
          amount,
          description,
          category,
          is_recurring: isRecurring,
          frequency,
        }),
      });

      if (res.ok) {
        updateTransaction({
          ...trx,
          amount,
          description,
          category,
          is_recurring: isRecurring,
          frequency,
        });
        setOpen(false);
        toast.success("Transaction updated successfully");
      } else {
        toast.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <div className="text-white transition-colors flex items-center justify-between gap-1 cursor-pointer rounded-sm py-1 px-2 group hover:bg-accent text-sm">
          <span>Edit Transaction</span>
          <Icon
            icon="line-md:edit"
            className="transition-colors duration-500"
            width={20}
            style={{
              color: "#f786ae",
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            <span>Update the amount for:</span>
            <span className="font-semibold text-foreground/80">
              {trx.category} – {trx.description}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <label>Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-[180px]"
          />
        </div>
        <div className="flex justify-between mt-2">
          <label>Description</label>
          <Input
            value={description!}
            onChange={(e) => setDescription(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <div className="flex justify-between mt-2 items-center">
          <label>Category</label>
          <Select
            value={category || "None"}
            onValueChange={(val) => setCategory(val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent className="max-w-60 md:max-w-sm">
              {(trx.type === "income"
                ? incomeCategories
                : expenseCategories
              ).map((cat, idx) => (
                <SelectItem key={`${cat}-${idx}`} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!trx.is_recurring && (
          <div className="flex justify-between mt-2 items-center">
            <label>Make Recurring</label>
            <Input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        )}

        {isRecurring && (
          <div className="flex justify-between items-center">
            <label className="mt-2">Frequency</label>
            <Select
              value={frequency ?? undefined}
              onValueChange={(val) =>
                setFrequency(
                  val as "daily" | "weekly" | "monthly" | "yearly" | null
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="border p-2 rounded-md text-base w-full max-w-56 md:max-w-sm">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter className="w-full mt-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-md w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-full"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
