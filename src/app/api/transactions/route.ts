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
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { selectTransactionType } from "@/schema/transactionForm";

const SECRET = process.env.JWT_SECRET as string;

async function verifyToken(req: NextRequest) {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("authToken")?.value;

  const authHeader = req.headers.get("Authorization");
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) return { authorized: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, SECRET);
    return { authorized: true, user: decoded };
  } catch (err) {
    return {
      authorized: false,
      error: `Invalid or expired token, ${(err as Error).message}`,
    };
  }
}

export async function GET(req: NextRequest) {
  const { authorized, error } = await verifyToken(req);
  if (!authorized) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  try {
    const transactionsList = await db.select().from(transactions);
    return NextResponse.json({
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
    const {
      type,
      amount,
      original_amount,
      original_currency,
      description,
      date,
      category,
      is_actual,
      recurring_parent_id,
      is_recurring,
      frequency,
      is_consistent_amount,
      status,
    } = await req.json();

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
        original_amount,
        original_currency,
        description: description || "",
        date,
        category,
        is_actual,
        recurring_parent_id,
        is_recurring,
        frequency,
        is_consistent_amount,
        status,
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

export async function PATCH(req: NextRequest) {
  const { authorized, user, error } = await verifyToken(req);

  if (!authorized) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  try {
    const { id, amount, description, category, is_actual } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const updateData: Partial<selectTransactionType> = {};

    if (amount !== undefined) updateData.amount = amount;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (is_actual !== undefined) updateData.is_actual = is_actual;

    await db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id));

    return NextResponse.json({
      user,
      message: "Transaction updated successfully",
      updatedTransaction: updateData,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Failed to update transaction",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
