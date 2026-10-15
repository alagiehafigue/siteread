import { readConfig, setUser } from "./config.js";

function main(){
  setUser("alagie")
  const configResult = readConfig()
  console.log(configResult);

}

main();