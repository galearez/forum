import { Pool } from 'pg';

export async function getPool() {
  const pool = new Pool({
    host: import.meta.env.PG_HOST,
    port: import.meta.env.PG_PORT,
    user: import.meta.env.PG_USER,
    password: import.meta.env.PG_PASSWORD,
    database: import.meta.env.PG_DATABASE,
  });
  return pool;
}
