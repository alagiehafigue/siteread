<h1 align="center">siteread</h1>

<p align="center">
  A multi-user command-line RSS feed aggregator. Follow blogs, collect their posts in the background, and read them from your terminal.
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM"></a>
  <a href="https://github.com/NaturalIntelligence/fast-xml-parser"><img src="https://img.shields.io/badge/fast--xml--parser-FF6600?style=for-the-badge&logo=rss&logoColor=white" alt="fast-xml-parser"></a>
  <a href="https://github.com/privatenumber/tsx"><img src="https://img.shields.io/badge/tsx-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="tsx"></a>
</p>

## Tech stack

| | Tool | Purpose |
|---|---|---|
| <img src="https://cdn.simpleicons.org/typescript/3178C6" width="22" alt="TypeScript"> | [TypeScript](https://www.typescriptlang.org/) | Language |
| <img src="https://cdn.simpleicons.org/nodedotjs/339933" width="22" alt="Node.js"> | [Node.js](https://nodejs.org/) | Runtime |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" width="22" alt="tsx"> | [tsx](https://github.com/privatenumber/tsx) | Runs TypeScript directly (`npm run start`) |
| <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="22" alt="PostgreSQL"> | [PostgreSQL](https://www.postgresql.org/) | Database |
| <img src="https://cdn.simpleicons.org/drizzle/C5F74F" width="22" alt="Drizzle"> | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe queries and schema |
| <img src="https://cdn.simpleicons.org/drizzle/C5F74F" width="22" alt="Drizzle Kit"> | [drizzle-kit](https://orm.drizzle.team/docs/kit-overview) | Generates and runs migrations |
| <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="22" alt="postgres.js"> | [postgres (postgres.js)](https://github.com/porsager/postgres) | PostgreSQL client used by Drizzle |
| <img src="https://cdn.simpleicons.org/rss/FF6600" width="22" alt="RSS"> | [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) | Parses RSS (XML) feeds |

## What is it for?

siteread is a multi-user command-line RSS feed aggregator written in TypeScript. Instead of visiting 20 blogs by hand to see if anything new was posted, you point siteread at their RSS feeds. It collects the posts for you and stores them, so you can browse them in one place.

It is built for local use on a single machine. There is no web server, only a PostgreSQL database. Several people can share one computer by registering as different users.

## How it works

1. **Register** a user and **add feeds** (a feed is a blog's RSS address).
2. **Follow** the feeds you care about.
3. Run **`agg`** in one terminal. Every interval it picks the feed that was fetched longest ago, downloads it, parses the XML, and saves new posts to the database.
4. Run **`browse`** in another terminal to read the latest posts from the feeds you follow.

Posts belong to a feed, not to a user. A user sees a post because they follow its feed.

## Features

- Multi-user support (register, login, list users)
- Add feeds, list all feeds, follow and unfollow feeds
- Long-running aggregator that scrapes feeds in a loop, oldest-fetched first
- Duplicate posts are skipped automatically (post URLs are unique)
- Browse the latest posts with a configurable limit
- Logged-in middleware so protected commands receive the current user
- Graceful shutdown with Ctrl+C

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- [PostgreSQL](https://www.postgresql.org/download/) 16 or newer
- npm (comes with Node.js)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd siteread
npm install
```

### 2. Install and start PostgreSQL

macOS (Homebrew):

```bash
brew install postgresql@16
brew services start postgresql@16
```

Linux / WSL (Debian or Ubuntu):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

Check the version:

```bash
psql --version
```

### 3. Create the database

Open the `psql` shell (macOS: `psql postgres`, Linux: `sudo -u postgres psql`), then run:

```sql
CREATE DATABASE gator;
\c gator
ALTER USER postgres PASSWORD 'postgres';
```

The `ALTER USER` line is for Linux / WSL. Use any password you like, just keep it in sync with the connection string below.

### 4. Create the config file

Create `~/.gatorconfig.json` in your home directory:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator"
}
```

siteread adds `current_user_name` to this file when you register or log in. Do not add it yourself.

Connection string format: `postgres://USER:PASSWORD@HOST:PORT/DATABASE`

### 5. Run the migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

This creates the `users`, `feeds`, `feed_follows` and `posts` tables.

## Usage

Run any command with:

```bash
npm run start <command> [arguments]
```

### Commands

| Command | Arguments | Needs login | Description |
|---|---|---|---|
| `register` | `<name>` | No | Create a user and log in as them |
| `login` | `<name>` | No | Switch to an existing user |
| `users` | none | No | List all users, marking the current one |
| `reset` | none | No | Delete all users (and their feeds, follows and posts) |
| `addfeed` | `<name> <url>` | Yes | Add a feed and automatically follow it |
| `feeds` | none | No | List all feeds and who added them |
| `follow` | `<url>` | Yes | Follow a feed that already exists |
| `following` | none | Yes | List the feeds you follow |
| `unfollow` | `<url>` | Yes | Stop following a feed |
| `agg` | `<time_between_reqs>` | No | Start the aggregator loop, for example `30s`, `1m`, `1h` |
| `browse` | `[limit]` | Yes | Show your latest posts (default limit is 2) |

### Example session

```bash
# Create a user
npm run start register lane

# Add some feeds (you follow them automatically)
npm run start addfeed "TechCrunch" "https://techcrunch.com/feed/"
npm run start addfeed "Hacker News" "https://news.ycombinator.com/rss"

# Terminal 1: start collecting posts every minute (Ctrl+C to stop)
npm run start agg 1m

# Terminal 2: read your latest 5 posts
npm run start browse 5
```

### Finding a feed address

Most blogs and news sites have one. Try the site's address plus `/feed`, `/rss` or `/index.xml`, or search the web for "site name RSS feed". If the address opens a page of XML text, that is the feed.

### Be kind to servers

`agg` makes real requests to other people's servers. Use an interval of `1m` or longer on real sites, and press Ctrl+C if something looks wrong. Never run it with a tiny interval like `1ms`.

## Database

| Table | Purpose | Key columns |
|---|---|---|
| `users` | People using siteread | `id`, `name` (unique) |
| `feeds` | Blog feeds | `id`, `name`, `url` (unique), `user_id`, `last_fetched_at` |
| `feed_follows` | Which user follows which feed | `user_id`, `feed_id` (unique pair) |
| `posts` | Saved articles | `id`, `title`, `url` (unique), `description`, `published_at`, `feed_id` |

Deleting a user also deletes their feeds and follows. Deleting a feed deletes its follows and posts (`ON DELETE CASCADE`).

## Project structure

```
siteread/
├── drizzle.config.ts        # drizzle-kit config (reads the DB URL from ~/.gatorconfig.json)
├── package.json
└── src/
    ├── index.ts             # Entry point: registers commands and runs them
    ├── commands.ts          # Command handlers, registry, middleware, scraper
    ├── config.ts            # Reads and writes ~/.gatorconfig.json
    ├── drizzle/             # Generated migrations
    └── lib/
        ├── rss.ts           # Fetches and parses RSS feeds
        └── db/
            ├── index.ts     # Database connection
            ├── schema.ts    # Table definitions
            └── queries/
                ├── users.ts
                ├── feeds.ts
                └── posts.ts
```

## Design notes

- **Command registry:** a lookup table that maps a command name (like `login`) to its handler function.
- **Logged-in middleware:** `middlewareLoggedIn` wraps a handler, checks that a user is logged in, and passes the user to the handler. This removes repeated code from `addfeed`, `follow`, `following`, `unfollow` and `browse`.
- **Scraping order:** `getNextFeedToFetch` sorts by `last_fetched_at` with `NULLS FIRST`, so new feeds are fetched before old ones, and the oldest-fetched feed always goes next.
- **Config file:** the app stores the database URL and the current user in a small JSON file. There is no real authentication, so anyone with the database credentials can act as any user. This is fine for a local project.

## Troubleshooting

| Problem | Likely fix |
|---|---|
| `Failed query` errors | Run `npx drizzle-kit generate` and `npx drizzle-kit migrate`, then check the tables with `\dt` in `psql` |
| Cannot connect to the database | Make sure PostgreSQL is running and `db_url` in `~/.gatorconfig.json` is correct |
| `reset` fails | Check that foreign keys use `ON DELETE CASCADE`, then migrate again |
| `Please login first` | Run `register <name>` or `login <name>` |
| Cannot find module errors | Use the `.js` extension in relative imports, for example `./config.js` |