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
import HoverEffect from "../effects/HoverEffect";
import PriceDisplay from "../common/Currency";
import { useBudget } from "@/contexts/BudgetContext";
import { motion } from "framer-motion";

export default function BalanceCard() {
  const { balance } = useBudget();
  const [animateText, setAnimateText] = useState(false);
  useEffect(() => {
    setAnimateText(true);
    setTimeout(() => setAnimateText(false), 500);
  }, [balance]);

  return (
    <HoverEffect className="p-2">
      <div className="flex flex-col items-center justify-center font-semibold text-foreground">
        <h2>Balance</h2>
        <motion.span
          animate={{ y: animateText ? 25 : 0, opacity: animateText ? 0 : 1 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <PriceDisplay amount={balance} />
        </motion.span>
      </div>
    </HoverEffect>
  );
}
