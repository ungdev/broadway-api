import dotenv from 'dotenv';
import database from '../src/database';
import seedItems from './items';

dotenv.config();

(async () => {
  const forceSync = process.argv.some((arg) => arg === '--force-sync');

  const { sequelize } = await database(forceSync);

  await seedItems();

  sequelize.close();
})();
