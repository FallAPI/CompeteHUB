import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isCloud = process.env.NODE_ENV === 'production';

const config: mysql.PoolOptions = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (isCloud) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  config.host = process.env.DB_HOST;
  config.port = Number(process.env.DB_PORT) || 3306;
}

const pool: Pool = mysql.createPool(config);

export default pool;
