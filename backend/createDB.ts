import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();
const execPromise = promisify(exec);

async function createDatabase() {
  const commands = [
    `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${process.env.DB_NAME}';`,
    `REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ${process.env.DB_USER};`,
    `REVOKE ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} FROM ${process.env.DB_USER};`,
    `REVOKE ALL ON SCHEMA public FROM ${process.env.DB_USER};`,
    `DROP DATABASE IF EXISTS ${process.env.DB_NAME};`,
    `DROP USER IF EXISTS ${process.env.DB_USER};`,
    `CREATE DATABASE ${process.env.DB_NAME};`,
    `CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD || ''}';`,
    `GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER};`,
  ];

  for (const command of commands) {
    try {
      await execPromise(`psql postgres -c "${command}"`);
    } catch (err) {
      console.error(`Error executing: ${command}`);
      console.error(err);
    }
  }

  try {
    await execPromise(
      `psql ${process.env.DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${process.env.DB_USER};"`
    );
    console.log('Granted schema permissions');
  } catch (err) {
    console.error('Error granting schema permissions:', err);
  }
}

createDatabase();
