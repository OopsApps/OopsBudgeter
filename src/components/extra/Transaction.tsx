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
import HoverEffect from "../effects/HoverEffect";
import PriceDisplay from "./Currency";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useBalance } from "@/contexts/BalanceContext";
import { formatDate } from "@/lib/formateDate";
import { selectTransactionType } from "@/schema/transactionForm";

export default function SingleTransaction({
  trx,
}: Readonly<{ trx: selectTransactionType }>) {
  const { refreshBalance } = useBalance();

  const handleDelete = async (id: number) => {
    const response = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.ok) {
      refreshBalance();
    } else {
      console.error(`Error: ${data.message}`);
    }
  };
  return (
    <HoverEffect
      bgColor={trx.type === "income" ? "#2DAC64" : "#e24444"}
      className="p-3"
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="max-w-56 sm:max-w-md break-words">
            {trx.description}
          </span>
          <span className="text-muted-foreground">{formatDate(trx.date)}</span>
        </div>
        <span
          className="font-bold"
          style={{
            color: trx.type === "income" ? "#2DAC64" : "#e24444",
          }}
        >
          <PriceDisplay amount={trx.amount} />
        </span>
      </div>
      <Icon
        onClick={() => handleDelete(trx.id)}
        icon="mdi:trash-can-empty"
        width={18}
        className="hover:text-white text-red-400 transition-colors absolute top-1 right-1"
      />
    </HoverEffect>
  );
}
