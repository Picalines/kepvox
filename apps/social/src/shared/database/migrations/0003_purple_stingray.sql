ALTER TABLE "project" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;