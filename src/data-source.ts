import { DataSource } from 'typeorm';
import { UserPair } from './entities/user-pair.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'assessment_db',
  entities: [UserPair],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV !== 'production',
});