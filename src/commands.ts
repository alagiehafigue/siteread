import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>


export function handlerLogin(cmdName: string, ...args: string[]){
  
  if (args.length === 0){
    throw new Error("username required");
  }

  const userName = args[0];
  setUser(userName);

  console.log(`Users has login successfully: ${userName}`);
  
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];

    if (!handler){
      throw new Error("Unknown command");
    }

    handler(cmdName, ...args);
}

