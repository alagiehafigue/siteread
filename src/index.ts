import { readConfig } from "./config.js";
import { handlerLogin, registerCommand, CommandsRegistry, runCommand } from "./commands.js";

function main(){
  const registry: CommandsRegistry = {}
  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);
  if (args.length === 0){
    console.error("Arguments values are missing...")
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    runCommand(registry, cmdName, ...cmdArgs);
    
  } catch (e) {
    console.error(e instanceof Error? e.message: e);
    process.exit(1)
  }

}

main();