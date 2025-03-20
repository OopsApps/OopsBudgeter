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
import { Icon } from "@iconify/react/dist/iconify.js";
import { selectTransactionType } from "@/schema/transactionForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useBudget } from "@/contexts/BudgetContext";

export default function RecurringStatusDialog({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { updateTransactionStatus } = useBudget();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(trx.status);

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trx.id, newStatus }),
      });

      if (res.ok) {
        updateTransactionStatus(trx.id, newStatus);
        setConfirmOpen(false);
        toast.success("The transaction status has been updated successfully");
      } else {
        console.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction", error);
    }
  };

  const colorBlock =
    newStatus === "active"
      ? "#3E70CC"
      : newStatus === "paused"
      ? "#DDBF3B"
      : "#E46060";

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild onClick={() => setConfirmOpen(true)}>
        <div className="text-white transition-colors flex items-center justify-between gap-1 cursor-pointer rounded-sm py-1 px-2 group hover:bg-accent text-sm">
          <span>Change Status</span>
          <Icon
            icon="fluent:calendar-arrow-repeat-all-16-filled"
            className="transition-colors duration-500"
            width={20}
            style={{
              color: colorBlock,
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Recurring Status</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            <span>
              Here you can change the status of your recurring transaction:
            </span>
            <span className="font-semibold text-foreground/80">
              {trx.category} - {trx.description}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Label>Status</Label>
          <Select
            defaultValue={newStatus}
            onValueChange={(value) => setNewStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={newStatus} />
            </SelectTrigger>
            <SelectContent className="border p-2 rounded-md text-base w-full max-w-56 md:max-w-sm">
              <SelectItem value="active" className="text-[#3E70CC]">
                Active
              </SelectItem>
              <SelectItem value="paused" className="text-[#DDBF3B]">
                Paused
              </SelectItem>
              <SelectItem value="canceled" className="text-[#E46060]">
                Canceled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="w-full mt-2">
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 border rounded-md w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-full"
          >
            Update
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
