import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'your_db_user',  // TODO: change to env variable
      password: 'your_db_password',  // TODO: change to env variable
      database: 'your_db_name',  // TODO: change to env variable
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
  },
};

export default config;
