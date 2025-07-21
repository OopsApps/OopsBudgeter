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

import { db } from "@/lib/db";
import { achievements } from "@/schema/dbSchema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db
    .select()
    .from(achievements)
    .where(eq(achievements.unlocked, true));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.id) {
    return new NextResponse("Missing achievement ID", { status: 400 });
  }

  const existing = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, body.id));

  if (existing.length === 0) {
    await db.insert(achievements).values({
      id: body.id,
      title: body.title || "Achievement",
      description: body.description || "",
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    });
  } else {
    await db
      .update(achievements)
      .set({
        unlocked: true,
        unlocked_at: new Date().toISOString(),
      })
      .where(eq(achievements.id, body.id));
  }

  return new NextResponse("Achievement processed", { status: 200 });
}
