CREATE TABLE "reaction" (
	"listener_id" text,
	"publication_id" uuid NOT NULL,
	"isPositive" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reaction_listener_id_publication_id_unique" UNIQUE("listener_id","publication_id")
);
--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_listener_id_user_id_fk" FOREIGN KEY ("listener_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;