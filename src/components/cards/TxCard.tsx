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

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface TxCardProps {
  className?: string;
  children: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  role?: string;
}

export default function TxCard({
  className,
  children,
  bgColor = "linear-gradient(135deg, #1c4dac, #1b8adf, #25a6ce, #30ba7c)",
  onClick,
  role,
}: Readonly<TxCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group h-full w-full relative transform-gpu overflow-hidden rounded-lg p-5 transition-all duration-300 border-2 bg-background cursor-pointer hover:brightness-150",
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: `${bgColor}20`,
      }}
      onClick={onClick}
      role={role}
    >
      {children}
    </motion.div>
  );
}
