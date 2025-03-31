CREATE TABLE "project" (
	"id" uuid PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"content" jsonb NOT NULL,
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
