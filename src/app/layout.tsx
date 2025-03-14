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
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import PasscodeWrapper from "@/components/security/PasscodeWrapper";
import GoToTop from "@/components/helpers/GoToTop";
import { BudgetProvider } from "@/contexts/BudgetContext";
import Toaster from "@/components/effects/Sonner";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import { generateMetadata } from "@/lib/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = generateMetadata;

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
  themeColor: "#166d3b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className="scroll-smooth scroll-p-4 overflow-hidden overflow-y-scroll"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-full flex justify-center items-center`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PasscodeWrapper>
            <BudgetProvider>
              <main className="p-0 md:p-6">
                <div className="relative flex flex-col justify-center items-center gap-4 bg-secondary p-6 max-w-2xl min-w-svw md:min-w-2xl md:rounded-lg">
                  <Logo />
                  <ThemeToggle />
                  {children}
                </div>
              </main>
              <GoToTop />
              <Toaster />
            </BudgetProvider>
          </PasscodeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
