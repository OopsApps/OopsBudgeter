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

import * as React from "react";
import HoverEffect from "../effects/HoverEffect";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBudget } from "@/contexts/BudgetContext";
import { Input } from "../ui/input";
import { useApp } from "@/contexts/AppContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supportedCurrencies } from "@/constants/currencies";
import Link from "next/link";

export function Settings() {
  const { currency, updateCurrency } = useBudget();
  const {
    appWidth,
    setAppWidth,
    colorfulCategories,
    setColorfulCategories,
    colorfulTransactions,
    setColorfulTransactions,
    soundEffects,
    setSoundEffects,
  } = useApp();

  return (
    <HoverEffect className="w-8 h-8 p-1 flex justify-center items-center absolute top-1 left-1">
      <Dialog>
        <DialogTrigger asChild>
          <Icon icon="line-md:cog-loop" width={32} height={32} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your budget app settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Link
                  href="https://en.wikipedia.org/wiki/ISO_4217"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Learn more about ISO 4217 currency codes"
                  className="hover:underline cursor-pointer"
                >
                  Currency:
                </Link>
                <Select
                  value={currency}
                  onValueChange={(value) => updateCurrency(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCurrencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="hidden md:flex justify-between items-center">
              <label>App Width:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Compact"
                    checked={appWidth === "Compact"}
                    onChange={() => setAppWidth("Compact")}
                  />
                  Compact
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Normal"
                    checked={appWidth === "Normal"}
                    onChange={() => setAppWidth("Normal")}
                  />
                  Normal
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label>Colorful Categories:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Compact"
                    checked={colorfulCategories === "Off"}
                    onChange={() => setColorfulCategories("Off")}
                  />
                  Off
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Normal"
                    checked={colorfulCategories === "On"}
                    onChange={() => setColorfulCategories("On")}
                  />
                  On
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label>Colorful Transactions:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Compact"
                    checked={colorfulTransactions === "Off"}
                    onChange={() => setColorfulTransactions("Off")}
                  />
                  Off
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Normal"
                    checked={colorfulTransactions === "On"}
                    onChange={() => setColorfulTransactions("On")}
                  />
                  On
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label>Sound Effects:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Compact"
                    checked={soundEffects === "Off"}
                    onChange={() => setSoundEffects("Off")}
                  />
                  Off
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="Normal"
                    checked={soundEffects === "On"}
                    onChange={() => setSoundEffects("On")}
                  />
                  On
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </HoverEffect>
  );
}
