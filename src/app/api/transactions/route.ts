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
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { QuickDB } from "quick.db";
import jwt from "jsonwebtoken";

const db = new QuickDB();
const SECRET = process.env.JWT_SECRET as string;
const BASE_URL = process.env.NEXT_PUBLIC_URL as string;

export async function GET() {
  const response = new NextResponse();

  response.headers.set("Access-Control-Allow-Origin", BASE_URL);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, SECRET);

    const transactions = await db.get("transactions");
    const currentBalance = await db.get("balance");

    response.headers.set("Content-Type", "application/json");

    return new NextResponse(
      JSON.stringify({
        user: decoded,
        transactions,
        currentBalance,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      response.headers.set("Content-Type", "application/json");

      return NextResponse.json(
        { message: "Invalid or expired token", error: err.message },
        { status: 401 }
      );
    } else {
      response.headers.set("Content-Type", "application/json");
      return NextResponse.json(
        { message: "Invalid or expired token", error: "Unknown error" },
        { status: 401 }
      );
    }
  }
}
export async function POST(request: Request) {
  const response = new NextResponse();

  response.headers.set("Access-Control-Allow-Origin", BASE_URL);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, amount, description, date }: Transaction =
      await request.json();

    let currentBalance = (await db.get("balance")) || 0;

    if (type === "income") {
      currentBalance += amount;
    } else if (type === "expense") {
      currentBalance -= amount;
    }

    let transactionId = (await db.get("transactionId")) || 0;
    transactionId++;

    const transaction: Transaction = {
      tid: transactionId,
      type,
      amount,
      description: description || "No description provided",
      date,
    };

    const transactions = (await db.get("transactions")) || [];

    transactions.push(transaction);

    await db.set("transactions", transactions);
    await db.set("transactionId", transactionId);

    await db.set("balance", currentBalance);

    return new NextResponse(
      JSON.stringify({
        message: "Transaction added",
        transaction,
        currentBalance,
      }),
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error) {
      response.headers.set("Content-Type", "application/json");
      return NextResponse.json(
        { message: "Failed to add a new transaction:", error: err.message },
        { status: 401 }
      );
    } else {
      response.headers.set("Content-Type", "application/json");
      return NextResponse.json(
        { message: "Failed to add a new transaction:", error: "Unknown error" },
        { status: 401 }
      );
    }
  }
}

export async function DELETE(request: Request) {
  const response = new NextResponse();

  response.headers.set("Access-Control-Allow-Origin", BASE_URL);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tid }: { tid: number } = await request.json();

    const transactions = (await db.get("transactions")) || [];

    const transactionToDelete = transactions.find(
      (transaction: Transaction) => transaction.tid === tid
    );

    if (!transactionToDelete) {
      return new NextResponse(
        JSON.stringify({ message: "Transaction not found" }),
        { status: 404 }
      );
    }

    const updatedTransactions = transactions.filter(
      (transaction: Transaction) => transaction.tid !== tid
    );

    let currentBalance = await db.get("balance");

    if (transactionToDelete.type === "income") {
      currentBalance -= transactionToDelete.amount;
    } else if (transactionToDelete.type === "expense") {
      currentBalance += transactionToDelete.amount;
    }

    await db.set("transactions", updatedTransactions);
    await db.set("balance", currentBalance);

    return new NextResponse(
      JSON.stringify({
        message: "Transaction deleted successfully",
        currentBalance,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      response.headers.set("Content-Type", "application/json");
      return NextResponse.json(
        { message: "Deletion was not successful", error: err.message },
        { status: 401 }
      );
    } else {
      response.headers.set("Content-Type", "application/json");
      return NextResponse.json(
        { message: "Deletion was not successful", error: "Unknown error" },
        { status: 401 }
      );
    }
  }
}
