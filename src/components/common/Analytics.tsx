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

import { useBudget } from "@/contexts/BudgetContext";
import { getMonthlyTrends } from "@/lib/monthlyTrends";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import React from "react";
import * as Recharts from "recharts";
import PriceDisplay from "./Currency";
import {
  getNoSpendStreak,
  getSpendingInsights,
  predictNextMonthSpending,
} from "@/lib/my1DollarAI";

export const chartColors = [
  "#2DAC64",
  "#E24444",
  "#FFB02E",
  "#0088FE",
  "#FF6347",
  "#A155B9",
  "#45C4B0",
  "#E4D374",
];

export default function AnalyticsWrapper() {
  const { transactions, filteredTransactions } = useBudget();
  const monthlyTrend = getMonthlyTrends(transactions);

  const incomeData = transactions.filter((trx) => trx.type === "income");
  const expenseData = transactions.filter((trx) => trx.type === "expense");

  const totalIncome = incomeData.reduce((acc, trx) => acc + trx.amount, 0);
  const totalExpenses = expenseData.reduce((acc, trx) => acc + trx.amount, 0);

  const categoryTotals = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((acc: Record<string, number>, trx) => {
      const category = trx.category ?? "Uncategorized";

      if (!acc[category]) acc[category] = 0;
      acc[category] += trx.amount;

      return acc;
    }, {});

  const pieChartData = Object.entries(categoryTotals).map(
    ([category, amount], index) => ({
      name: category,
      value: amount,
      color: chartColors[index % chartColors.length],
    })
  );

  const netWorthTrend = transactions.reduce(
    (acc: Record<string, { name: string; balance: number }>, trx) => {
      const month = format(new Date(trx.date), "MMM yyy");
      if (!acc[month]) acc[month] = { name: month, balance: 0 };
      acc[month].balance += trx.type === "income" ? trx.amount : -trx.amount;
      return acc;
    },
    {}
  );
  const netWorthData = Object.values(netWorthTrend).sort(
    (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
  );

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const monthsTracked = new Set(
    transactions
      .filter((trx) => trx.date)
      .map((trx) => format(new Date(trx.date), "MMM yyy"))
  ).size;
  const avgSpending = monthsTracked > 0 ? totalExpenses / monthsTracked : 0;

  const categoryTrends = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((acc: Record<string, Record<string, number>>, trx) => {
      const month = format(new Date(trx.date), "MMM yyyy");

      if (!acc[month]) acc[month] = {}; // ✅ No more `{ name: string }` in numeric data

      acc[month][trx.category ?? "Uncategorized"] =
        (acc[month][trx.category ?? "Uncategorized"] || 0) + trx.amount;

      return acc;
    }, {});

  const monthlyCategoryTrends = Object.entries(categoryTrends).map(
    ([month, values]) => ({
      name: month,
      ...values,
    })
  );

  const topTransactions = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="border-t-2 border-black/20 flex flex-col gap-5">
      <div className="flex flex-col gap-1 justify-center items-center mt-2 mb-4">
        <h1 className="text-2xl font-bold flex gap-1 items-center">
          <Icon
            icon="icon-park-twotone:chart-line-area"
            width={22}
            className="cursor-pointer"
          />
          OopsStats + fakeAI
        </h1>
        <span className="text-muted-foreground text-center max-w-xl">
          In this page we break down your finances so you can pretend to have
          control over them. See exactly how much you spent on ‘necessary’
          impulse buys and why your bank account is crying. No refunds, just
          regrets!
        </span>
      </div>

      <div className="bg-background p-4 rounded-lg text-center">
        <h2 className="text-lg font-semibold">💰 Savings Rate</h2>
        <p
          className={`text-2xl font-bold ${
            savingsRate < 20 ? "text-red-500" : "text-green-500"
          }`}
        >
          {savingsRate.toFixed(2)}%
        </p>
        {savingsRate < 20 && (
          <p className="text-red-400">Bruh, stop spending 😱💸</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">📉 Average Monthly Spending</h2>
          <p className="text-2xl font-bold text-yellow-500">
            <PriceDisplay amount={Number(avgSpending.toFixed(2))} />
          </p>
        </div>

        <div className="bg-background p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">🔥 No-Spend Streak</h2>
          <p className="text-2xl font-bold text-green-500">
            {getNoSpendStreak(transactions)}
          </p>
        </div>

        <div className="bg-background p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">
            💸 Biggest Spending Category
          </h2>
          <p className="text-2xl font-bold text-red-500">
            {getSpendingInsights(filteredTransactions)}
          </p>
        </div>

        <div className="bg-background p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">
            📊 Next Months Predicted Spending
          </h2>
          <p className="text-2xl font-bold text-orange-500">
            {predictNextMonthSpending(filteredTransactions)}
          </p>
        </div>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">💰 Income vs. Expenses</h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.BarChart
            data={[
              { name: "Total", income: totalIncome, expenses: totalExpenses },
            ]}
          >
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground shadow-md">
                      <p className="font-bold">
                        {payload[0]?.payload?.name ?? "Unknown"}
                      </p>
                      {payload.map((entry, index) => {
                        const key = String(entry.dataKey);
                        const amount =
                          typeof entry.value === "number"
                            ? entry.value.toFixed(2)
                            : "0.00";
                        return (
                          <p key={index} className="flex justify-between">
                            <span
                              className={
                                key === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </span>
                            <PriceDisplay amount={Number(amount)} />
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Recharts.Legend />
            <Recharts.Bar dataKey="income" fill="#2DAC64" />
            <Recharts.Bar dataKey="expenses" fill="#E24444" />
          </Recharts.BarChart>
        </Recharts.ResponsiveContainer>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">💸 Spending Breakdown</h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.PieChart>
            <Recharts.Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {pieChartData.map((entry, index) => (
                <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Recharts.Pie>
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground shadow-md">
                      <p className="font-bold">
                        {data.name ?? "Uncategorized"}
                      </p>
                      <p>
                        💰 Total Spent:{" "}
                        <PriceDisplay
                          amount={
                            typeof data.value === "number"
                              ? data.value.toFixed(2)
                              : "0.00"
                          }
                        />
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </Recharts.PieChart>
        </Recharts.ResponsiveContainer>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📈 Monthly Trends</h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.LineChart data={monthlyTrend}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground shadow-md">
                      <p className="font-bold">
                        {payload[0]?.payload?.name ?? "Unknown Month"}
                      </p>
                      {payload.map((entry, index) => {
                        const key = String(entry.dataKey);
                        const amount =
                          typeof entry.value === "number"
                            ? entry.value.toFixed(2)
                            : "0.00";
                        return (
                          <p key={index} className="flex justify-between">
                            <span
                              className={
                                key === "income"
                                  ? "text-green-500"
                                  : key === "expenses"
                                  ? "text-red-500"
                                  : "text-foreground"
                              }
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </span>
                            <PriceDisplay amount={Number(amount)} />
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Recharts.Legend />
            <Recharts.Line
              type="monotone"
              dataKey="income"
              stroke="#2DAC64"
              strokeWidth={2}
            />
            <Recharts.Line
              type="monotone"
              dataKey="expenses"
              stroke="#E24444"
              strokeWidth={2}
            />
          </Recharts.LineChart>
        </Recharts.ResponsiveContainer>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          🌊 Expense Trends by Category
        </h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.AreaChart data={monthlyCategoryTrends}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground shadow-md">
                      <p className="font-bold">
                        {payload[0]?.payload?.name ?? "Unknown Month"}
                      </p>
                      {payload.map((entry, index) => {
                        const key = String(entry.dataKey);
                        const amount =
                          typeof entry.value === "number"
                            ? entry.value.toFixed(2)
                            : "0.00";
                        const color = entry.color || "#FFFFFF"; // ✅ Get color from Recharts or default white

                        return (
                          <p
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              ></span>
                              <span
                                style={{
                                  color: color,
                                }}
                              >
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </span>
                            </span>
                            <PriceDisplay amount={Number(amount)} />
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Recharts.Legend />
            {Object.keys(
              categoryTrends[Object.keys(categoryTrends)[0]] ?? {}
            ).map((cat, idx) => (
              <Recharts.Area
                key={cat}
                dataKey={cat}
                stackId="1"
                stroke={chartColors[idx]}
                fill={chartColors[idx]}
              />
            ))}
          </Recharts.AreaChart>
        </Recharts.ResponsiveContainer>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          💸 Top 5 Biggest Transactions
        </h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.BarChart data={topTransactions}>
            <Recharts.XAxis />
            <Recharts.YAxis />
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground">
                      <p>
                        💰 Amount:{" "}
                        <PriceDisplay amount={data.amount.toFixed(2)} />
                      </p>
                      <p>📂 Category: {data.category ?? "Uncategorized"}</p>
                      <p className="text-sm">{data.description}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Recharts.Legend />
            <Recharts.Bar dataKey="amount" fill="#FFB02E" />
          </Recharts.BarChart>
        </Recharts.ResponsiveContainer>
      </div>

      <div className="bg-background p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📈 Net Worth Over Time</h2>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.LineChart data={netWorthData}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-2 rounded-md text-foreground shadow-md">
                      <p className="font-bold">{data.name}</p>
                      <p>
                        📊 Balance:{" "}
                        <PriceDisplay amount={data.balance.toFixed(2)} />
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />{" "}
            <Recharts.Legend />
            <Recharts.Line
              type="monotone"
              dataKey="balance"
              stroke="#2DAC64"
              strokeWidth={2}
            />
          </Recharts.LineChart>
        </Recharts.ResponsiveContainer>
      </div>
    </div>
  );
}
