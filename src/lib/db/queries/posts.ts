import { desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { posts, feedsFolllows } from "../schema.js";

export async function createPost(post: {
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  feedId: string;
}) {
  const [result] = await db
    .insert(posts)
    .values(post)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      title: posts.title,
      url: posts.url,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .innerJoin(feedsFolllows, eq(posts.feedId, feedsFolllows.feedId))
    .where(eq(feedsFolllows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}