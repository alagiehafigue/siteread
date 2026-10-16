import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, feedsFolllows, users } from "../schema.js";

export async function createFeed(name: string, url: string, userId: string){
  const [result] = await db.insert(feeds).values({name, url, userId }).returning();
  return result 
}

export async function getFeeds(){
  const result = db.select({FeedName: feeds.name, url: feeds.url, userName: users.name }).from(feeds).innerJoin(users, eq(feeds.userId, users.id));
  return result;
}

export async function createFeedFollow(userId: string, feedId: string){
  const [newFeedFollow] = await db.insert(feedsFolllows).values({ userId, feedId }).returning();

  const [result] = await db
  .select({
    id: feedsFolllows.id,
    feedName: feeds.name,
    userName: users.name,
  })
  .from(feedsFolllows)
  .innerJoin(feeds, eq(feedsFolllows.feedId, feeds.id))
  .innerJoin(users, eq(feedsFolllows.userId, users.id))
  .where(eq(feedsFolllows.id, newFeedFollow.id));

return result;
}

export async function getFeedByUrl(url: string){
   const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeedFollowsForUser(userId: string){
  const result = await db
  .select({
    id: feedsFolllows.id,
    feedName: feeds.name,
    userName: users.name,
  })
  .from(feedsFolllows)
  .innerJoin(feeds, eq(feedsFolllows.feedId, feeds.id))
  .innerJoin(users, eq(feedsFolllows.userId, users.id))
  .where(eq(feedsFolllows.userId, userId));

return result;  

}