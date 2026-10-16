import { setUser } from "./config.js";
import { createUser, getUser } from "./lib/db/queries/users.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>


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

  console.log(`New user ${name} is created`);
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

