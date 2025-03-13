CREATE TYPE "public"."TransactionType" AS ENUM('income', 'expense');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE TransactionType;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET NOT NULL;