ALTER TABLE "feeds" ADD COLUMN "last_fetched_at" timestamp;--> statement-breakpoint
ALTER TABLE "feeds_follow" DROP COLUMN "last_fetched_at";