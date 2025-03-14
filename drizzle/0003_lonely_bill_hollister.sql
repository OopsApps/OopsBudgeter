CREATE TYPE "public"."ExpenseCategories" AS ENUM('Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Other');--> statement-breakpoint
CREATE TYPE "public"."IncomeCategories" AS ENUM('Salary', 'Freelance', 'Investment', 'Bonus', 'Other');--> statement-breakpoint
DROP TABLE "currentBalance" CASCADE;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category" text;