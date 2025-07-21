CREATE TYPE "public"."Frequency" AS ENUM('daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "frequency" SET DATA TYPE Frequency;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "frequency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "frequency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "original_amount" real;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "original_currency" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "recurring_parent_id" integer;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "is_consistent_amount" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "expected_amount";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "for_month";