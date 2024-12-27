import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();
const execPromise = promisify(exec);

async function createDatabase(dbName: string, dbUser: string, dbPassword: string) {
  const commands = [
    `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${dbName}';`,
    `REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ${dbUser};`,
    `REVOKE ALL PRIVILEGES ON DATABASE ${dbName} FROM ${dbUser};`,
    `REVOKE ALL ON SCHEMA public FROM ${dbUser};`,
    `DROP DATABASE IF EXISTS ${dbName};`,
    `DROP USER IF EXISTS ${dbUser};`,
    `CREATE DATABASE ${dbName};`,
    `CREATE USER ${dbUser} WITH PASSWORD '${dbPassword}';`,
    `GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUser};`,
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
    await execPromise(`psql ${dbName} -c "GRANT ALL ON SCHEMA public TO ${dbUser};"`);
    console.log(`Granted schema permissions for ${dbName}`);
  } catch (err) {
    console.error(`Error granting schema permissions for ${dbName}:`, err);
  }
}

async function setup() {
  await createDatabase(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!);
  await createDatabase(
    process.env.TEST_DB_NAME!,
    process.env.TEST_DB_USER!,
    process.env.TEST_DB_PASSWORD!
  );
}

setup();
