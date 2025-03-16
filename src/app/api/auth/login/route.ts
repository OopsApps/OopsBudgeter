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

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET as string;
const PASSCODE = process.env.PASSCODE as string;

export async function verifyToken(req: NextRequest) {
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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const { passcode } = await request.json();

    if (passcode !== PASSCODE) {
      return NextResponse.json(
        { message: "Incorrect passcode" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ user: "authenticated" }, SECRET, {
      expiresIn: "7d",
    });

    cookieStore.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
