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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  const { soundEffects } = useApp();

  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchExchangeRates("USD");
      setExchangeRates(rates);
    };

    fetchRates();
  }, []);

  const { addTransaction } = useBudget();

  const handleToggle = (selectedType: "income" | "expense") => {
    setType(selectedType);
    form.setValue("type", selectedType);
  };

  const form = useForm<insertTransactionType>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      date: new Date(),
      category: "None",
      is_recurring: false,
      frequency: "monthly",
      status: "active",
    },
  });

  const onSubmit = async (data: insertTransactionType) => {
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

    const formData = {
      ...data,
      amount: amountInUSD,
      date: utcDate.toISOString(),
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
        addTransaction(result.transaction);
        toast.success(
          formData.type === "income"
            ? "Income added successfully! 💰"
            : "Expense recorded! 💸"
        );
        const audio = new Audio(
          formData.type === "income"
            ? "/audio/new-expense.wav"
            : "/audio/new-income.wav"
        );
        audio.volume = 0.1;
        if (soundEffects === "On") {
          audio.play();
        }
        form.reset();
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-lg w-full h-full py-2 flex flex-col space-y-10 justify-between"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({}) => (
                    <FormItem className="flex justify-center items-center mb-6 space-x-2">
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                          type === "income" ? "bg-green-500" : "bg-gray-700"
                        }`}
                        onClick={() => handleToggle("income")}
                      >
                        Income
                      </button>
                      <Input
                        {...form.register("type")}
                        value={type}
                        type="hidden"
                      />
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                          type === "expense" ? "bg-red-500" : "bg-gray-700"
                        }`}
                        onClick={() => handleToggle("expense")}
                      >
                        Expense
                      </button>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 px-4 md:px-0">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Category</FormLabel>
                        <Select
                          defaultValue={field.value || "None"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={field.value || "None"} />
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
                    control={form.control}
                    name="amount"
                    render={({}) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Amount</FormLabel>
                        <Input
                          type="number"
                          className="max-w-60 md:max-w-sm text-right"
                          {...form.register("amount", {
                            setValueAs: (value) =>
                              value === "" ? value : parseFloat(value),
                          })}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({}) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          {...form.register("description")}
                          className="max-w-60 md:max-w-sm"
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex justify-between">
                        <FormLabel>Date</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="is_recurring"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <FormLabel>Recurring?</FormLabel>
                        <Input
                          type="checkbox"
                          className="w-5 h-5 accent-green-500 bg-amber-400"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          ref={field.ref}
                        />
                      </FormItem>
                    )}
                  />

                  {form.watch("is_recurring") && (
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem className="flex justify-between">
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            defaultValue={field.value || "None"}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue
                                placeholder={field.value || "None"}
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
                </div>

                <HoverEffect className="flex justify-center items-center bg-blue-600 max-h-10 p-0">
                  <button
                    className="w-full h-full cursor-pointer p-2 rounded-lg text-center font-semibold text-black dark:text-white"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Transaction"}
                  </button>
                </HoverEffect>

                <div
                  className={`fixed bottom-2.5 left-1/2 transform -translate-x-1/2 w-80 text-red-500 rounded-lg bg-red-950 p-2 px-4 transition-all text-base duration-300 ${
                    form.formState.errors.amount ||
                    form.formState.errors.description
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  {form.formState.errors.amount && (
                    <p>{form.formState.errors.amount.message}</p>
                  )}
                  {form.formState.errors.description && (
                    <p>{form.formState.errors.description.message}</p>
                  )}
                  {form.formState.errors.description && (
                    <p>{form.formState.errors.description.message}</p>
                  )}
                  {form.formState.errors.date && (
                    <p>{form.formState.errors.date.message}</p>
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
