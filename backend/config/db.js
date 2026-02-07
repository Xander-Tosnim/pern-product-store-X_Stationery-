import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

// creates a SQL connection using environment variables
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`);