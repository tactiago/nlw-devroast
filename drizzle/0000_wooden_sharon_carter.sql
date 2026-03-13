CREATE TYPE "public"."severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('needs_serious_help', 'below_average', 'average', 'above_average', 'impressive', 'legendary');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"severity" "severity" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" varchar(50) NOT NULL,
	"line_count" integer NOT NULL,
	"roast_mode" boolean DEFAULT false NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"roast_quote" text NOT NULL,
	"verdict" "verdict" NOT NULL,
	"suggested_fix" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_submissions_score" ON "submissions" USING btree ("score");