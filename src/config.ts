import os from "node:os";
import path from "node:path";
import fs, { write } from "node:fs";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
}

function getConfigFilePath(){
const home = os.homedir();
const filePath = path.join(home, ".gatorconfig.json");

return filePath;


}

 function writeConfig(cfg: Config):void{
  const {dbUrl: db_url, currentUserName: current_user_name} = cfg;

  const text =  JSON.stringify(
    {
      db_url,
      current_user_name
    }
  )

  fs.writeFileSync(getConfigFilePath(), text)
}

function validateConfig(rawConfig: any): Config{

  if (typeof rawConfig !== "object" ||  rawConfig === null){
    throw new Error("Invalid objects")
  }

  if ( typeof rawConfig.db_url !== "string" ){
    throw new Error("Property is not string")
  }
 
  if (typeof rawConfig.current_user_name !== "undefined" && typeof rawConfig.current_user_name !== "string"){
    throw new Error("Property is missing string or undefined")
  }
  return {
   dbUrl: rawConfig.db_url,
   currentUserName: rawConfig.current_user_name

  }

}

export function readConfig(): Config{
  const filePath = getConfigFilePath();
  const readFile = fs.readFileSync(filePath, "utf-8");

  const parsed = JSON.parse(readFile);
  const validateFile = validateConfig(parsed);

  return validateFile;
}

export function setUser(userName: string): void{
    const config = readConfig();
     config.currentUserName = userName;
     writeConfig(config)
}