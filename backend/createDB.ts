import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();
const execPromise = promisify(exec);

async function createDatabase() {
  const commands = [
    `CREATE DATABASE ${process.env.DB_NAME};`,
    `CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD || ''}';`,
    `GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER};`,
  ]
  
  for (const command of commands) {
    try {
      await execPromise(`psql postgres -c "${command}"`);
    } catch (err) {
      console.error(`Error executing: ${command}`);
      console.error(err);
    }
  }
}

createDatabase();
