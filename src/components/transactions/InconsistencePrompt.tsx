import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react/dist/iconify.js";

export function AmountMismatchDialog({
  trxId,
  trxAmount,
  onConfirm,
}: {
  trxId: number;
  trxAmount: number;
  onConfirm: (amount: number) => void;
}) {
  const [actualAmount, setActualAmount] = React.useState(trxAmount);

  const handleConfirm = async () => {
    const res = await fetch("/api/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: trxId,
        is_actual: true,
        amount: actualAmount,
      }),
    });

    if (res.ok) {
      onConfirm(actualAmount);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-yellow-500 hover:text-yellow-600"
          title="Amount inconsistency"
        >
          <Icon icon="mdi:alert-circle" width={18} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Actual Amount</DialogTitle>
          <DialogDescription>
            This recurring transaction has a different amount than expected.
            Would you like to update it?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            placeholder="Enter actual amount"
            value={actualAmount}
            onChange={(e) => setActualAmount(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleConfirm}>
            Keep
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
