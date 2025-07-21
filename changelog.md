# OopsBudgeter Changelog

## v3.0.0 - Achievements & Original Currency Magic 🏆💸  
**Released: July 21, 2025**

This update is packed with juicy new features, smart upgrades, and fixes that’ll make you fall in love with your budget all over again. Unlock achievements, and flex your original currency—because *we’re international now* 😏🌍

---

### ✨ New Features

- 🔄 **Recurring System Rewritten**  
  - Completely revamped the recurring transactions logic.  
  - Includes a **sleek new toggle** for enabling/disabling recurring mode.  
  - More stable, visually polished, and intuitive to use.

- 🏆 **Achievements System Added**  
  - 10+ achievements now track your financial activity.  
  - Locked achievements show as darkened + blurred with a lil’ lock 🔒  
  - Toast and **YAY** sound plays when unlocking one for the first time.  
  - Tracks unlocks based on transaction history dynamically.

- 💱 **Original Currency Display**  
  - If your transaction used another currency, hover to see the original amount.  
  - Toggle “Show Original Currency” in settings to enable or disable.  
  - Smarter currency handling overall 💸

- 🧾 **Receipt Fixes & Print Polishing**  
  - First-time print preview no longer appears empty.  
  - Currency and data show consistently now.

- 🧠 **Update Checker**  
  - App checks if a newer version exists on GitHub (`oopsapps/oopsbudgeter`).  
  - Shows update notification with a link to the repo *only if* a newer version is found.

- ⚙️ **Footer Improvements**  
  - Developer credit added.  
  - App version now displayed, pulled directly from `package.json`.

---

### 🛠️ Bug Fixes & Improvements

- Fixed types for recurring frequency fields and null handling.  
- Improved validation for import data.  
- Ensured dark/light mode compatibility in Other UI.  
- Toasts and audio won’t trigger repeatedly—only once per unlock.
- Rewrote recurring transaction logic for improved stability and user experience.

---

### 🔨 Dev Notes

- Achievements use images from `public/achievements/{id}.png`  

---

**It’s time to make budgeting feel rewarding again. Let’s gooo!** 🔥💻💖  

## v2.3.0 - Recurring Transactions & Transaction Menu Revamp 🚀  
**Released: March 20, 2025**  

**Right-Click Your Transactions... Because You Can Now 😎**  
This update introduces a **sleek right-click menu** for transactions! You can now delete them, download receipts, or manage recurring settings like an absolute boss.  

### 🛠️ Bug Fixes & Improvements  
- **Automated Recurring Transactions 🔄**  
  - Self-hosted users now have **`node-cron`** running automatically.  
  - Vercel users rely on **API-based scheduling (`/api/cron`)** instead.  
  - No more "Wait, why didn’t my transaction repeat?" moments.  

- **Improved Transaction Menu 🎛️**  
  - **Right-click any transaction** for instant options!  
  - **New Actions:**  
    ✅ **Delete** 🗑️ - Because mistakes happen.  
    ✅ **Download Receipt** 📄 - Official-looking proof of your spending habits.  
    ✅ **Change Recurring Status** 🔄 - Activate, pause, or cancel recurring transactions easily.  

- **CSV & JSON Export Enhancements 📤**  
  - **Added formatted currency** (`$1,000.00 USD` instead of `1000`).  
  - CSV filenames now include **timestamps** for better organization.  
  - **Descriptions won’t break CSV formatting anymore** (no more weird Excel errors).  

- **API Cleanup & Fixes 🛠️**  
  - Removed the unnecessary `req` parameter from `/api/cron`.  
  - **Improved TypeScript handling** (no more `Promise<any>` nonsense).  

🔥 **Now transactions are smarter, exports are cleaner, and right-clicking things actually does something. Enjoy!** 🎉


---

## v2.2.1 - Patched The Api Error 🥲
**Released: March 17, 2025**

**Live Without A Bug For One Day... One Day**
This update just fixes the crazy error from the previous commit!

### 🛠️ Bug Fixes & Improvements
 - Fixed The Wrong Implementation Of My Own Code... Can You Imagine That? I Could

---

## v2.2.0 - Smart Settings & Dynamic Currency 💰🌍
**Released: March 17, 2025**

**Take Control of Your Budget, Your Way!**
This update introduces powerful new settings, including custom currency selection with live conversion, dynamic app width customization, and vibrant transaction visuals—making your budget smarter and more intuitive than ever before!

## ✨ New & Improved
### 💰 Dynamic Currency Selection & Live Conversion
- Set your preferred currency in the new Settings Menu, and it will persist per device.
- If a default currency is needed, ENV configuration allows for a global default.
- Live currency conversion ensures that your amounts stay accurate across different currencies!
  - Example: If you add 10 USD on USD currency option and switch to EUR, it correctly converts and shows 9.20 EUR.
  - And, when adding 10 EUR on EUR currency option and switched back to USD, it shows $10.87 USD. Aka, live conversion with the help of something API I forgot T-T

### ⚙️ Fully Customizable App Width
- Compact or Normal mode—choose the best fit for your screen from Settings.
- Your preference persists per device, ensuring a seamless experience.

### 🎨 Colorful Categories & Transaction Backgrounds
- Categories of each type now has a predefined, unique color, making them instantly recognizable (Red for expense and Green of income).
- Transactions' colored backgrounds are now optional in the settings menu, but for now giving your financial history a vibrant, clean look with dark and minimal color.

### 🛠️ Bug Fixes & Improvements
- Fixed Date Picker Crash: Clearing the date no longer results in an "Invalid Date" error or a full page crash. Now, it properly resets to the first day of the current month.
- Optimized Color & Data Handling: Transactions load faster and smoother without flickering or mismatched colors... I guess, joking of course!!!!!!!!!!!

---

## v2.1.0 - Balance Toggle ⚖️
**Released: March 15, 2025**

**Your Balance, Your Rules!**
This update brings a brand-new Balance Mode Toggle, giving you full control over how you view your finances. Whether you want a total balance across all time or a filtered balance within a specific timeframe, you can now switch seamlessly with just a click!

## ✨ New & Improved
### 💡 Balance Mode Toggle
- 🌍 Total Balance Mode – See your all-time financial overview, tracking every income and expense ever recorded.
- 📆 Timeframe Balance Mode – Focus on just the selected period (e.g., this month, this week).
- 💾 Saves your preference automatically, so you don’t have to toggle it every session!

### 🛠️ Fixes & Adjustments
- Improved UI transitions when switching balance views.
- Fixed a state reset issue when rapidly switching modes.

---

## v2.0.7 - More Automated 🚀
**Released: March 15, 2025**  

This update fine-tunes Docker handling and an even smoother self-hosting process. Now, deploying is **effortless**, and keeping your app up-to-date is a breeze 😏  

### ✨ **New Features**  
- **💡 Automatic Docker Versioning**  
  - Docker images now use the **version from `package.json`** for better tracking.  
  - Every release is now **tagged properly**, no more overwriting images!  

---

## v2.0.5 - Docker Optimization 🐋
**Released: March 15, 2025**

**More Automation, More Control!**
This update brings seamless Docker versioning, ensuring self-hosters and deployments stay in sync without the hassle. No more mismatched builds—just smooth, tagged releases every time 😏

## ✨ **New & Improved**  
### 💡 **Automatic Docker Versioning**  
- Every image is now **tagged with both `latest` and the actual app version** from `package.json` (e.g., `1.2.3`).  
- **No more overwriting old versions**—rollback anytime!  

### 🔄 **Smoother Self-Hosting Experience**  
- Forks & self-hosted deployments now work **out of the box**.  
- No more manual fixes—just deploy and enjoy!  

---

## v2.0.0 - The Ultimate Overhaul 🚀🔥
**Released: March 15, 2025**

**Major Upgrade from v1.0.0: A Complete Revamp!**
We threw out the old, brought in the new, and gave OopsBudgeter a complete makeover! Say goodbye to QuickDB and hello to PostgreSQL, charts, advanced analytics, and a sleek UI 😏

### ✨ **New Features**
- **🚀 Migrated from QuickDB to PostgreSQL** for a scalable and robust database solution.
- **📊 Brand New Analytics Page!**
  - **Expense Heatmap 🔥** - Track your spending habits visually.
  - **FakeAI Insights 🤖** - Smart(ish) spending analysis & predictions.
  - **Net Worth Over Time 📈** - See your financial trajectory.
  - **Category Trends 🌊** - Track expenses per category monthly.
  - **Top Transactions 💸** - Your biggest income/expenses at a glance.
- **🔍 Advanced Filtering & Sorting**
  - Filter transactions by **date range, category, type, and amount**.
  - Sort by **newest, oldest, highest, lowest** with a click.
- **🆕 Enhanced Transaction Handling**
  - Add/edit transactions with a **datetime picker** (ensures correct timestamps!).
  - **New Categories** for better tracking of income & expenses.
  - **Passcode Protection 🔒** - Secure your financial data.
  - **Instant Toaster Notifications** for transaction actions.
- **📂 Data Export:** Download transactions in **CSV or JSON** for backups.

### 🔄 **Improvements & Refactors**
- **🎨 Revamped UI & UX**
  - New modern **dark-themed UI**.
  - Improved responsiveness for **desktop & mobile**.
- **♻️ Moved Balance Logic to Context API** for cleaner state management.
- **🚀 Optimized Docker Image**
  - Switched to **multi-stage build** for a smaller and more efficient container.
  - Added automatic **PostgreSQL migrations** on startup.
- **🔧 Fixed Various Bugs**
  - Password prompt **no longer flickers**.
  - Fixed **date picker not updating correctly**.
  - Fixed **sorting and filtering edge cases**.

### 💥 **Breaking Changes**
- **Old QuickDB-based data is not compatible.** Migration to PostgreSQL is required.
- **New environment variables are needed:**
  ```ini
  DATABASE_URL=your-postgres-db-url
  NEXT_PUBLIC_CURRENCY=USD
  PASSCODE=123456
  JWT_SECRET=your-secure-jwt-secret
  ```

### 📢 **Next Steps**
- **Real AI-powered insights** (instead of FakeAI predictions 😉)
- **Recurring Transactions & Budget Goals!**
- **Improved mobile experience.**

---
**Thanks for using OopsBudgeter – The OopsApps Team 💜**

