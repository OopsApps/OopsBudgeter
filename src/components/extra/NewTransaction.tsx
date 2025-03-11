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

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import HoverEffect from "../effects/HoverEffect";
import { Icon } from "@iconify/react";
import { transactionSchema } from "@/schema/transactionForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBalance } from "@/contexts/BalanceContext";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  description?: string;
  date?: string;
}

export default function NewTransaction() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { setCurrentBalance } = useBalance(); 
  const [type, setType] = useState<"income" | "expense">("income");
  const [popupVisible, setPopupVisible] = useState(false);

  const handleToggle = (selectedType: "income" | "expense") => {
    console.log("Selected type:", selectedType); 
    setType(selectedType);
    setValue("type", selectedType); 
  };

  const showPopup = () => {
    setPopupVisible(true); 
    setTimeout(() => {
      setPopupVisible(false); 
    }, 3000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    const formData = { ...data };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Transaction added successfully!");
        setCurrentBalance(result.currentBalance); 
        reset();
        showPopup();
      } else {
        setSuccessMessage(`Error: ${result.message}`);
        showPopup();
      }
    } catch (err) {
      setSuccessMessage(`Something went wrong: ${err}`);
      showPopup();
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <HoverEffect className="max-w-60 max-h-10 flex items-center justify-center gap-2 bg-blue-500/50 ">
          <Icon icon="line-md:text-box-multiple-twotone-to-text-box-twotone-transition" />
          New Transaction
        </HoverEffect>
      </DrawerTrigger>
      <DrawerContent>
        <div className="h-[420px] flex flex-col gap-4 justify-center items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg w-full h-full py-10 flex flex-col space-y-10 justify-between"
          >
            <div className="flex justify-center items-center mb-4 space-x-2">
              <button
                type="button"
                className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                  type === "income" ? "bg-green-500" : "bg-gray-700"
                }`}
                onClick={() => handleToggle("income")} 
              >
                Income
              </button>
              <button
                type="button"
                className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                  type === "expense" ? "bg-red-500" : "bg-gray-700"
                }`}
                onClick={() => handleToggle("expense")}
              >
                Expense
              </button>
            </div>

            <input {...register("type")} value={type} type="hidden" />

            <div className="flex flex-col gap-4 px-4 md:px-0">
              <div className="flex justify-between">
                <label>Amount</label>
                <Input
                  type="number"
                  className="max-w-3xs md:max-w-sm text-right"
                  {...register("amount", {
                    setValueAs: (value) =>
                      value === "" ? 0 : parseFloat(value),
                  })}
                />
              </div>
              <div className="flex justify-between">
                <label>Description</label>
                <Textarea
                  {...register("description")}
                  className="max-w-3xs md:max-w-sm"
                />
              </div>
              <div className="flex justify-between">
                <label>Date</label>
                <Input
                  type="datetime-local"
                  className="max-w-3xs md:max-w-sm text-right"
                  {...register("date")}
                />
              </div>
            </div>

            <HoverEffect
              onClick={handleSubmit(onSubmit)} 
              role="button"
              className="cursor-pointer rounded-lg text-center font-semibold flex justify-center items-center bg-blue-600 text-white max-h-10"
            >
              Add Transaction
            </HoverEffect>

            <div
              className={`fixed -bottom-4 left-1/2 transform -translate-x-1/2 w-80 bg-green-600/20 text-green-500 rounded-lg p-2 px-4 transition-all duration-300 ${
                popupVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {successMessage && <p>{successMessage}</p>}
            </div>
            <div
              className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80 bg-red-600/20 text-red-500 rounded-lg p-2 px-4 transition-all duration-300 ${
                errors.amount || errors.description
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {errors.amount && <p>{errors.amount.message}</p>}
              {errors.description && <p>{errors.description.message}</p>}
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
