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

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import HoverEffect from "../effects/HoverEffect";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  insertTransactionSchema,
  insertTransactionType,
} from "@/schema/transactionForm";
import { Form, FormItem, FormField, FormLabel } from "../ui/form";
import { toast } from "sonner";
import { format } from "date-fns";
import { useBudget } from "@/contexts/BudgetContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { expenseCategories, incomeCategories } from "@/lib/categories";
import { fetchExchangeRates } from "../common/Currency";
import { ScrollArea } from "../ui/scroll-area";
import { useApp } from "@/contexts/AppContext";

export default function NewTransaction() {
  const { currency } = useBudget();
  const [type, setType] = useState<"income" | "expense">("income");
  const [mode, setMode] = useState<"normal" | "recurring">("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const { soundEffects } = useApp();
  const { addTransaction } = useBudget();

  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchExchangeRates("USD");
      setExchangeRates(rates);
    };
    fetchRates();
  }, []);

  const unifiedForm = useForm<insertTransactionType>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      date: new Date(),
      category: "None",
      type: "income",
      frequency: "monthly",
      status: "active",
      is_recurring: false,
      is_actual: true,
    },
  });

  const handleToggleType = (selectedType: "income" | "expense") => {
    setType(selectedType);
    unifiedForm.setValue("type", selectedType);
  };

  const handleModeChange = (selectedMode: "normal" | "recurring") => {
    setMode(selectedMode);
    unifiedForm.setValue("is_recurring", selectedMode === "recurring");
  };

  const onSubmitUnified = async (data: insertTransactionType) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const localDate = new Date(data.date);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    const correctCurrency =
      currency.length !== 3 ? "USD" : currency.toUpperCase();
    const exchangeRate = exchangeRates[correctCurrency] || 1;
    const amountInUSD = data.amount / exchangeRate;

    const amountAddedAs = currency !== "USD" ? data.amount : undefined;

    const formData = {
      ...data,
      amount: amountInUSD,
      date: utcDate.toISOString(),
      ...(amountAddedAs !== undefined && { amount_added_as: amountAddedAs }),
      ...(currency !== "USD" && {
        original_amount: data.amount,
        original_currency: currency.toUpperCase(),
      }),
    };

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
        if (mode === "recurring") {
          addTransaction(result.transaction);
          addTransaction({
            ...result.transaction,
            is_recurring: false,
          });
        } else {
          addTransaction(result.transaction);
        }

        await fetch("/api/cron");

        toast.success(
          formData.type === "income"
            ? "Income added successfully! 💰"
            : "Expense recorded! 💸"
        );
        const audio = new Audio(
          formData.type === "income"
            ? "/audio/new-income.wav"
            : "/audio/new-expense.wav"
        );
        audio.volume = 0.1;
        if (soundEffects === "On") {
          audio.play();
        }

        unifiedForm.reset({
          amount: NaN,
          description: "",
          date: new Date(),
          category: "None",
          type,
          frequency: "monthly",
          status: "active",
          is_recurring: mode === "recurring",
          is_actual: true,
          is_consistent_amount: true,
        });
      }
    } catch (err) {
      toast.error(`Something went wrong: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <HoverEffect className="max-w-56 max-h-10 flex items-center justify-center gap-2 bg-blue-500/50">
          <Icon icon="line-md:text-box-multiple-twotone-to-text-box-twotone-transition" />
          <span className="text-black dark:text-white">New Transaction</span>
        </HoverEffect>
      </DrawerTrigger>
      <DrawerContent
        aria-describedby="Adding a new transaction menu"
        className="max-h-svh"
      >
        <ScrollArea className="overflow-auto p-4 scroll-smooth scroll-p-2 no-scrollbar">
          <DrawerTitle className="hidden">Add a new transaction</DrawerTitle>
          <div className="h-full flex flex-col gap-4 justify-center items-center">
            <Form {...unifiedForm}>
              <form
                onSubmit={unifiedForm.handleSubmit(onSubmitUnified)}
                className="max-w-lg w-full h-full py-2 flex flex-col space-y-10 justify-between"
              >
                <FormField
                  control={unifiedForm.control}
                  name="type"
                  render={() => (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                          type === "income" ? "bg-green-600" : "bg-secondary"
                        }`}
                        onClick={() => handleToggleType("income")}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                          type === "expense" ? "bg-red-600" : "bg-secondary"
                        }`}
                        onClick={() => handleToggleType("expense")}
                      >
                        Expense
                      </button>
                      <Input
                        {...unifiedForm.register("type")}
                        value={type}
                        type="hidden"
                      />
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                      mode === "normal" ? "bg-slate-700" : "bg-secondary"
                    }`}
                    onClick={() => handleModeChange("normal")}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                      mode === "recurring" ? "bg-slate-700" : "bg-secondary"
                    }`}
                    onClick={() => handleModeChange("recurring")}
                  >
                    Recurring
                  </button>
                </div>

                <div className="flex flex-col gap-4 px-4 md:px-0">
                  <FormField
                    control={unifiedForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value ?? "None"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={field.value ?? "None"} />
                          </SelectTrigger>
                          <SelectContent
                            className="max-w-60 md:max-w-sm"
                            aria-describedby="Select a category"
                          >
                            {(type === "income"
                              ? incomeCategories
                              : expenseCategories
                            ).map((cat, idx) => (
                              <SelectItem key={`${cat}-${idx}`} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={unifiedForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Amount</FormLabel>
                        <Input
                          type="number"
                          className="max-w-60 md:max-w-sm text-right"
                          {...field}
                          value={isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? NaN : parseFloat(val));
                          }}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={unifiedForm.control}
                    name="description"
                    render={() => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          {...unifiedForm.register("description")}
                          className="max-w-60 md:max-w-sm"
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={unifiedForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>
                          {mode === "recurring" ? "Start Date" : "Date"}
                        </FormLabel>
                        <input
                          {...field}
                          type="datetime-local"
                          className="border p-2 rounded-md text-base max-w-60 md:max-w-sm w-full"
                          value={
                            field.value
                              ? format(
                                  new Date(field.value),
                                  "yyyy-MM-dd'T'HH:mm:ss"
                                )
                              : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
                          }
                          onClick={(e) =>
                            (e.target as HTMLInputElement).showPicker()
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? format(
                                    new Date(e.target.value),
                                    "yyyy-MM-dd'T'HH:mm:ss"
                                  )
                                : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
                            )
                          }
                        />
                      </FormItem>
                    )}
                  />

                  {mode === "recurring" && (
                    <FormField
                      control={unifiedForm.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem className="flex justify-between">
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            value={field.value ?? "monthly"}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue
                                placeholder={field.value ?? "monthly"}
                              />
                            </SelectTrigger>
                            <SelectContent className="border p-2 rounded-md text-base w-full max-w-56 md:max-w-sm">
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === "recurring" ? (
                    <FormField
                      control={unifiedForm.control}
                      name="is_consistent_amount"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center gap-2">
                          <FormLabel
                            htmlFor="is_consistent_amount"
                            className="m-0"
                          >
                            Consistent Amount
                          </FormLabel>
                          <Input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(e) => field.onChange(e.target.checked)}
                            id="is_consistent_amount"
                            className="w-4 h-4"
                          />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={unifiedForm.control}
                      name="is_actual"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center gap-2">
                          <FormLabel htmlFor="is_actual" className="m-0">
                            Actual Amount
                          </FormLabel>
                          <Input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(e) => field.onChange(e.target.checked)}
                            id="is_actual"
                            className="w-4 h-4"
                          />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <HoverEffect className="flex justify-center items-center bg-blue-600 max-h-10 p-0">
                  <button
                    className="w-full h-full cursor-pointer p-2 rounded-lg text-center font-semibold text-black dark:text-white"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting
                      ? "Adding..."
                      : mode === "recurring"
                      ? "Add Recurring Transaction"
                      : "Add Transaction"}
                  </button>
                </HoverEffect>

                <div
                  className={`fixed bottom-2.5 left-1/2 transform -translate-x-1/2 w-80 text-red-500 rounded-lg bg-red-950 p-2 px-4 transition-all text-base duration-300 ${
                    unifiedForm.formState.errors.amount ||
                    unifiedForm.formState.errors.description
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  {unifiedForm.formState.errors.amount && (
                    <p>{unifiedForm.formState.errors.amount.message}</p>
                  )}
                  {unifiedForm.formState.errors.description && (
                    <p>{unifiedForm.formState.errors.description.message}</p>
                  )}
                  {unifiedForm.formState.errors.date && (
                    <p>{unifiedForm.formState.errors.date.message}</p>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
