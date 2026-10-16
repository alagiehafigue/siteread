import { handlerLogin, registerCommand, CommandsRegistry, runCommand, handlerRegister, handlerReset } from "./commands.js";

async function main(){
  const registry: CommandsRegistry = {}
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset)

  const args = process.argv.slice(2);
  if (args.length === 0){
    console.error("Arguments values are missing...")
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
    
  } catch (e) {
    console.error(e instanceof Error? e.message: e);
    process.exit(1)
  }


  process.exit(0);

}

main();