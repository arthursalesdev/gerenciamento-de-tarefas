import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/database/schemas/*.js",
    out: "./drizzle/migrations",
    dialect: "postgresql",

    dbCredentials: {
        url: process.env.DATABASE_URL
    }
});