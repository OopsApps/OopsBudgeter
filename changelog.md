# OopsBudgeter Changelog

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

