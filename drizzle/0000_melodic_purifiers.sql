CREATE TABLE "balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"amount" real NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now()
);
