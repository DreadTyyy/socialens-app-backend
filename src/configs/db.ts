import { createPool } from 'mysql2';
import dotenv from "dotenv";

dotenv.config();

export const connection = createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "socialens",
    port: Number(process.env.DB_PORT) || 3306
});