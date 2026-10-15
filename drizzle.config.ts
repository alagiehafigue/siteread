import {readConfig} from "./src/config.js"
import { defineConfig } from "drizzle-kit";


const connectionUrl = readConfig().dbUrl

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionUrl
  },
});