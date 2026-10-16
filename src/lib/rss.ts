import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const res = await fetch(feedURL, {
    headers: { "User-Agent": "gator" },
  });

  const text = await res.text();
  const parser = new XMLParser({ processEntities: false });
  const data = parser.parse(text);

  const channel = data.rss?.channel;
  if (!channel) {
    throw new Error("No channel present");
  }

  const { title, link, description } = channel;
  if (
    typeof title !== "string" ||
    typeof link !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Channel is missing title, link or description");
  }

  let rawItems: any[] = [];
  if (Array.isArray(channel.item)) {
    rawItems = channel.item;
  } else if (channel.item) {
    rawItems = [channel.item];
  }

  const item: RSSItem[] = [];
  for (const i of rawItems) {
    if (
      typeof i.title !== "string" ||
      typeof i.link !== "string" ||
      typeof i.description !== "string" ||
      typeof i.pubDate !== "string"
    ) {
      continue;
    }
    item.push({
      title: i.title,
      link: i.link,
      description: i.description,
      pubDate: i.pubDate,
    });
  }

  return { channel: { title, link, description, item } };
}