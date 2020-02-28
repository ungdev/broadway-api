import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import log from './utils/log';
import { devEnv, dbName, dbUsername, dbPassword, dbHost, dbPort } from './utils/env';

const createViews = async (sequelize: Sequelize) => {
  sequelize.query('CREATE OR REPLACE VIEW orders_not_deleted AS SELECT * FROM orders WHERE deletedAt IS NULL');
  sequelize.query('CREATE OR REPLACE VIEW users_not_deleted AS SELECT * FROM users WHERE deletedAt IS NULL');
};

export default async (_forceSync = false) => {
  let sequelize: Sequelize;

  try {
    sequelize = new Sequelize({
      database: dbName(),
      username: dbUsername(),
      password: dbPassword(),
      host: dbHost(),
      dialect: 'mysql',
      port: dbPort(),
      models: [path.join(__dirname, 'models')],
      logging: (sql: string) => log.info(sql),
    });
  } catch (err) {
    log.error(err);
    process.exit(1);
  }

  process.on('SIGINT', async () => {
    try {
      await sequelize.close();
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  });

  if (_forceSync && !devEnv()) {
    log.error('You must set your NODE_ENV to development to force sync the database');
    process.exit(1);
  }

  const forceSync = _forceSync && devEnv();

  if (forceSync) {
    log.warn('Database synced with force. Be careful...');
  }

  await sequelize.sync({ force: forceSync });
  await createViews(sequelize);

  log.info('Connected to database');

  return { sequelize };
};
