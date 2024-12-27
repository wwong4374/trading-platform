import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './stonks/db/migrations',
    },
    seeds: {
      directory: './stonks/db/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      port: 5432,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      directory: './stonks/db/migrations',
    },
    seeds: {
      directory: './stonks/db/seeds',
    },
  },
};

export default config;
