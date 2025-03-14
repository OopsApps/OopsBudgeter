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

import { selectTransactionType } from "@/schema/transactionForm";
import { saveAs } from "file-saver";

export const printTransactions = (transactions: selectTransactionType[]) => {
  const printWindow = window.open("", "_blank");
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
                <th class="px-4 py-2 text-sm font-medium border">Amount</th>
                <th class="px-4 py-2 text-sm font-medium border max-w-md truncate">Description</th>
                <th class="px-4 py-2 text-sm font-medium border">Date</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${transactions
                .map(
                  (trx) => `
                    <tr class="odd:bg-gray-100 even:bg-white hover:bg-gray-200">
                      <td class="border px-4 py-2">${trx.id}</td>
                      <td class="border px-4 py-2">${trx.type}</td>
                      <td class="border px-4 py-2">${trx.amount} ${
                    process.env.NEXT_PUBLIC_CURRENCY
                  }</td>
                      <td class="border px-4 py-2 max-w-md break-words">${
                        trx.description
                      }</td>
                      <td class="border px-4 py-2">${new Date(
                        trx.date
                      ).toLocaleString()}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }
};

export const exportTransactions = (transactions: selectTransactionType[]) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Date,Category,Amount,Type,Description"]
      .concat(
        transactions.map((trx) =>
          [trx.type, trx.amount, trx.date, trx.category, trx.description].join(
            ","
          )
        )
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "transactions.csv");
};
