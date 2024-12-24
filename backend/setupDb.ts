import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const sql = `
CREATE DATABASE ${process.env.DB_NAME};
CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD || ''}';
GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER};
`

const command = `psql postgres -c "${sql}"`
exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  console.log(`Database ${process.env.DB_NAME} created successfully: ${stdout}`);
});
