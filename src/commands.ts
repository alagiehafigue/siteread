import { convertProcessSignalToExitCode } from "node:util";
import { readConfig, setUser } from "./config.js";
import { createFeed, createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds } from "./lib/db/queries/feeds.js";
import { createUser, deleteUsers, getUser, getUsers } from "./lib/db/queries/users.js";
import { Feed, feeds, User } from "./lib/db/schema.js";
import { fetchFeed } from "./lib/rss.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;


 const url = "https://www.wagslane.dev/index.xml";

 export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const currentUserName = readConfig().currentUserName
    if (!currentUserName){
      throw new Error("User not found");
    }

    const user = await getUser(currentUserName);
    if (!user){
      throw new Error(`User not found`);
    }

    await handler(cmdName, user, ...args)

    
    
  };
}

 


export async function handlerLogin(cmdName: string, ...args: string[]){
  
  if (args.length === 0){
    throw new Error("username is required...");
  }

  const name = args[0];
  const loginUser = await getUser(name)
  
  if (!loginUser){
    throw new Error("Users doesn't exist...")
  }

  setUser(name);

  console.log(`User ${name} has login successfully`);
  
}

export async function handlerRegister(cmdName: string, ...args: string[]){
  if (args.length === 0){
    throw new Error("Argument values are missing...")
  }

  const name = args[0];
  const userExist = await getUser(name);

  if (userExist){
    throw new Error("User already exist...")

  }

 const newUser = await createUser(name
  )

 
  setUser(name)

  console.log("New user  is created:");
  console.log(newUser);
}

export async function handlerReset(cmdName: string){
  await deleteUsers();

  console.log(`Users deleteted successfully`);

}

export async function handlerAgg(cmdName: string){
  const feed = await fetchFeed(url);
  console.log(JSON.stringify(feed, null, 2));

}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]){
  const name = args[0];
  const feedURL = args[1];
  
  if (args.length !== 2){
    throw new Error("Missing arguments values <name> and <url>");
  }

  const feed = await createFeed(name, feedURL, user.id);
  const feedfollows = await createFeedFollow(user.id, feed.id);
  

  printFeed(feed, user);
  console.log(feedfollows.feedName, feedfollows.userName);

}

export async function handlerFeeds(cmdName: string){
  const feeds = await getFeeds();

  if (feeds.length === 0){
    throw new Error ("No feeds found...");
  }

  for (const feed of feeds){
    console.log(feed.FeedName, feed.url, feed.userName);
  }

}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]){
   const feedURL = args[0];
  
  if (args.length !== 1){
    throw new Error("Missing arguments values <name> and <url>");
  }


  const feed = await getFeedByUrl(feedURL);
  
  if (!feed){
    throw new Error("Feed not found");
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(feedFollow.feedName, feedFollow.userName);

}

export async function handlerFollowing(cmdName: string, user: User){
  const feedFollows = await getFeedFollowsForUser(user.id);

  for (const feedFollow of feedFollows){
    console.log(feedFollow.feedName)
  }

}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]){
  if (args.length !== 1){
    throw new Error("Missing argument");
  }

  await deleteFeedFollow(user.id, args[0]);

  console.log(`You decided to unfollow ${args[0]}`);
}




export async function handlerUsers(cmdName: string){
  if (!cmdName){
    throw new Error("Missing command or try adding <user>..")
  }

  const users = await getUsers();
  const currentUserName = readConfig().currentUserName;

  for (const user of users){
    console.log(`* ${user.name} ${user.name === currentUserName? "(current)": ""}`)
  }
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];

    if (!handler){
      throw new Error("Unknown command");
    }

   await handler(cmdName, ...args);
}


function printFeed(feed: Feed, user: User){
  console.log(feed.name)
  console.log(feed.url)
  console.log(feed.id)
  console.log(user.name)
}
