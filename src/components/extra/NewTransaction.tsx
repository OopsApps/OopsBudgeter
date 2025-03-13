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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBalance } from "@/contexts/BalanceContext";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  insertTransactionSchema,
  insertTransactionType,
} from "@/schema/transactionForm";
import { Form, FormItem, FormField, FormLabel } from "../ui/form";
import { DatetimePicker } from "../ui/date";

export default function NewTransaction() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { refreshBalance } = useBalance();
  const [type, setType] = useState<"income" | "expense">("income");
  const [popupVisible, setPopupVisible] = useState(false);

  const handleToggle = (selectedType: "income" | "expense") => {
    setType(selectedType);
    form.setValue("type", selectedType);
  };

  const showPopup = (message: string) => {
    setSuccessMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const form = useForm<insertTransactionType>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (data: insertTransactionType) => {
    const localDate = new Date(data.date);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    const formData = {
      ...data,
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

      if (response.ok) {
        refreshBalance();
        form.reset();
        showPopup("Transaction added successfully!");
      }
    } catch (err) {
      showPopup(`Something went wrong: ${err}`);
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-lg w-full h-full py-10 flex flex-col space-y-10 justify-between"
            >
              <FormField
                control={form.control}
                name="type"
                render={({}) => (
                  <FormItem className="flex justify-center items-center mb-4 space-x-2">
                    <FormLabel></FormLabel>
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
                  name="amount"
                  render={({}) => (
                    <FormItem className="flex justify-between">
                      <FormLabel>Amount</FormLabel>
                      <Input
                        type="number"
                        className="max-w-3xs md:max-w-sm text-right"
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
                        className="max-w-3xs md:max-w-sm"
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
                      {/* <Input
                        type="datetime-local"
                        className="max-w-3xs md:max-w-sm text-right"
                        {...form.register("date")}
                      /> */}
                      <DatetimePicker
                        {...field}
                        value={field.value}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <HoverEffect
                onClick={form.handleSubmit(onSubmit)}
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
                className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80 text-red-500 rounded-lg bg-red-950 p-2 px-4 transition-all text-base duration-300 ${
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
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
