import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
} as DataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established!');
  })
  .catch((err) => {
    console.error('❌ Database connection failed', err);
  });
