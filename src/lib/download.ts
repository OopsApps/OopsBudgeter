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

import {
  fetchExchangeRates,
  formatCurrency,
} from "@/components/common/Currency";
import { selectTransactionType } from "@/schema/transactionForm";
import { saveAs } from "file-saver";

export const printTransactions = async (
  transactions: selectTransactionType[],
  currency = "USD"
) => {
  const printWindow = window.open("", "_blank");

  const exchangeRates = await fetchExchangeRates("USD");
  const correctCurrency =
    currency.length !== 3 ? "USD" : currency.toUpperCase();
  const baseRate = exchangeRates["USD"] || 1;
  const targetRate = exchangeRates[correctCurrency] || 1;

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>All Transactions</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex flex-col items-center p-6">
          <h1 class="text-2xl font-semibold mb-6">Transactions List</h1>
          <table class="w-4/5 max-w-4xl border-collapse shadow-lg bg-white">
            <thead class="bg-green-500 text-white">
              <tr>
                <th class="px-4 py-2 text-sm font-medium border">ID</th>
                <th class="px-4 py-2 text-sm font-medium border">Type</th>
                <th class="px-4 py-2 text-sm font-medium border">Category</th>
                <th class="px-4 py-2 text-sm font-medium border">Amount</th>
                <th class="px-4 py-2 text-sm font-medium border max-w-md truncate">Description</th>
                <th class="px-4 py-2 text-sm font-medium border">Date</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${transactions
                .map((trx) => {
                  const convertedAmount = (trx.amount / baseRate) * targetRate;
                  const formattedAmount = formatCurrency(
                    convertedAmount,
                    correctCurrency
                  );
                  const originalInfo =
                    trx.original_amount && trx.original_currency
                      ? ` (${formatCurrency(
                          trx.original_amount,
                          trx.original_currency
                        )})`
                      : "";

                  return `
                    <tr class="odd:bg-gray-100 even:bg-white hover:bg-gray-200">
                      <td class="border px-4 py-2">${trx.id}</td>
                      <td class="border px-4 py-2">${trx.type}</td>
                      <td class="border px-4 py-2">${trx.category}</td>
                      <td class="border px-4 py-2">${formattedAmount}${originalInfo}</td>
                      <td class="border px-4 py-2 max-w-md break-words">${
                        trx.description
                      }</td>
                      <td class="border px-4 py-2">${new Date(
                        trx.date
                      ).toLocaleString()}</td>
                    </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

export const exportTransactions = async (
  transactions: selectTransactionType[]
) => {
  const headers = [
    "id",
    "date",
    "type",
    "amount",
    "original_amount",
    "original_currency",
    "description",
    "category",
    "status",
    "recurring_parent_id",
    "is_recurring",
    "frequency",
  ];

  const csvRows = transactions.map((trx): string => {
    const row = [
      trx.id ?? "",
      trx.date ?? "",
      trx.type ?? "",
      trx.amount ?? "",
      trx.original_amount ?? "",
      trx.original_currency ?? "",
      trx.description ? `"${trx.description.replace(/"/g, '""')}"` : "",
      trx.category ?? "",
      trx.status ?? "",
      trx.recurring_parent_id ?? "",
      trx.is_recurring ?? "",
      trx.frequency ?? "",
    ];
    return row.join(",");
  });

  const csvContent = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
  const filename = `transactions_${timestamp}.csv`;

  saveAs(blob, filename);
};

export const downloadJSON = async (
  transactions: selectTransactionType[],
  currency = "USD"
) => {
  const exchangeRates = await fetchExchangeRates("USD");
  const correctCurrency =
    currency.length !== 3 ? "USD" : currency.toUpperCase();
  const baseRate = exchangeRates["USD"] || 1;
  const targetRate = exchangeRates[correctCurrency] || 1;

  const formattedTransactions = transactions.map((trx) => ({
    id: trx.id,
    type: trx.type,
    category: trx.category,
    amount: trx.amount,
    formattedAmount: formatCurrency(
      (trx.amount / baseRate) * targetRate,
      correctCurrency
    ),
    description: trx.description || "N/A",
    date: trx.date,
  }));

  const jsonData = JSON.stringify(formattedTransactions, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
  const filename = `transactions_${timestamp}.json`;

  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = filename;

  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();

  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(downloadAnchor.href);
};

export const printReceipt = async (
  transaction: selectTransactionType,
  currency = "USD"
) => {
  const receiptWindow = window.open("", "_blank");

  const exchangeRates = await fetchExchangeRates("USD");
  const correctCurrency =
    currency.length !== 3 ? "USD" : currency.toUpperCase();
  const baseRate = exchangeRates["USD"] || 1;
  const targetRate = exchangeRates[correctCurrency] || 1;

  const convertedAmount = (transaction.amount / baseRate) * targetRate;

  const formattedAmount = formatCurrency(convertedAmount, correctCurrency);
  const originalInfo =
    transaction.original_amount && transaction.original_currency
      ? `(${formatCurrency(
          transaction.original_amount,
          transaction.original_currency
        )}) `
      : "";

  if (receiptWindow) {
    receiptWindow.document.write(`
     <html lang="en">
      <head>
        <title>Transaction Receipt</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { 
            size: A6; 
            margin: 0;
          }
          body { 
            font-family: monospace; 
            padding: 20px; 
            text-align: center; 
            background: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="max-w-xs mx-auto p-4 bg-white border border-gray-300 shadow-md">
          <h2 class="text-lg font-bold text-center mb-2">OopsBudgeter Receipt</h2>
          <div class="border-b border-dashed border-gray-400 my-3"></div>

          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <strong>Transaction ID:</strong> <span>#${transaction.id}</span>
            </div>
            <div class="flex justify-between">
              <strong>Type:</strong> <span>${
                transaction.type &&
                transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)
              }</span>
            </div>
            <div class="flex justify-between">
              <strong>Date:</strong> <span>${transaction.date}</span>
            </div>
            <div class="flex justify-between">
                <strong>Amount:</strong> <span class="uppercase">${originalInfo}${formattedAmount}</span>
            </div>
            <div class="flex justify-between">
              <strong>Category:</strong> <span>${transaction.category}</span>
            </div>
            <div class="flex flex-col text-left mt-2">
              <strong>Description:</strong> 
              <span class="break-words">${
                transaction.description || "N/A"
              }</span>
            </div>
          </div>

          <div class="border-b border-dashed border-gray-400 my-3"></div>

          <div class="text-xs text-gray-600 text-center mt-2">
            Thank you for using OopsBudgeter!<br />
            Manage your finances smarter & easier.
          </div>
        </div>
      </body>
    </html>
  `);
    receiptWindow.document.close();
    receiptWindow.onload = () => {
      receiptWindow.print();
    };
  }
};
