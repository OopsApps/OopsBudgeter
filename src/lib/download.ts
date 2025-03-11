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

import { Transaction } from "@/types/Transaction";

export const printTransactions = (transactions: Transaction[]) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>All Transactions</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f4f7f6;
            }
            h1 {
              text-align: center;
              font-size: 2.5rem;
              margin-bottom: 20px;
              color: #333;
            }
            table {
              border-collapse: collapse;
              width: 80%;
              max-width: 1000px;
              margin: 0 auto;
              border: 1px solid #ddd;
              background-color: white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            th, td {
              padding: 15px;
              text-align: center;
              border: 1px solid #ddd;
            }
            th {
              background-color: #4CAF50;
              color: white;
              font-size: 1.2rem;
            }
            td {
              font-size: 1rem;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #e9e9e9;
            }
            @media print {
              body {
                height: auto;
                margin: 0;
                padding: 20px;
              }
              table {
                width: 100%;
                box-shadow: none;
              }
              h1 {
                font-size: 2rem;
              }
            }
          </style>
        </head>
        <body>
          <h1 class="text-2xl font-semibold mb-6">Transactions List</h1>
          <table class="table-auto mx-auto border-collapse shadow-lg">
            <thead class="bg-green-500 text-white">
              <tr>
                <th class="px-4 py-2 text-sm font-medium">ID</th>
                <th class="px-4 py-2 text-sm font-medium">Type</th>
                <th class="px-4 py-2 text-sm font-medium">Amount</th>
                <th class="px-4 py-2 text-sm font-medium">Description</th>
                <th class="px-4 py-2 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              ${transactions
                .map(
                  (trx) => `
                    <tr>
                      <td class="border px-4 py-2">${trx.tid}</td>
                      <td class="border px-4 py-2">${trx.type}</td>
                      <td class="border px-4 py-2">${trx.amount} ${
                    process.env.NEXT_PUBLIC_CURRENCY
                  }</td>
                      <td class="border px-4 py-2">${trx.description}</td>
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
