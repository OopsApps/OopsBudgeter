/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import { db } from "@/lib/db";
import { transactions } from "@/schema/dbSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { expenseCategories, incomeCategories } from "@/lib/categories";
import { verifyToken } from "../auth/login/route";

export async function GET(req: NextRequest) {
  const { authorized, user, error } = await verifyToken(req);

  if (!authorized) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  try {
    const transactionsList = await db.select().from(transactions);
    return NextResponse.json({
      user,
      transactions: transactionsList,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Failed to fetch transactions",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized, user, error } = await verifyToken(req);

  if (!authorized) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  try {
    const { type, amount, description, date, category } = await req.json();

    const validCategories =
      type === "income" ? incomeCategories : expenseCategories;
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { message: `Invalid category for type '${type}'` },
        { status: 400 }
      );
    }

    const newTransaction = await db
      .insert(transactions)
      .values({
        type,
        amount,
        description: description || "",
        date,
        category,
      })
      .returning();

    return NextResponse.json(
      {
        user,
        message: "Transaction added",
        transaction: newTransaction[0],
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to add transaction", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { authorized, user, error } = await verifyToken(req);

  if (!authorized) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    const transactionToDelete = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    if (!transactionToDelete.length) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    await db.delete(transactions).where(eq(transactions.id, id));

    return NextResponse.json(
      {
        user,
        message: "Transaction deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Failed to delete transaction",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
