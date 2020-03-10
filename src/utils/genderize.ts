/* eslint-disable import/first */
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
import database from '../database';
import User from '../models/user';
import log from './log';

(async () => {
  const { sequelize } = await database();

  const users = await User.findAll({
    attributes: ['firstname'],
    where: {
      gender: null,
    },
    group: ['firstname'],
  });

  await Promise.all(
    users.map(async (user) => {
      try {
        const response = await axios.get('https://api.genderize.io', {
          params: {
            name: user.firstname,
          },
        });

        if (response.status === 200) {
          let { gender } = response.data;

          if (gender === null) {
            gender = 'unknown';
          }

          log.info(`Update ${user.firstname}: ${gender}`);

          await User.update(
            {
              gender,
            },
            {
              where: {
                gender: null,
                firstname: user.firstname,
              },
            },
          );
        } else {
          log.error(`An error occurred. HTTP Code: ${response.status}`);
        }
      } catch (err) {
        log.error(err);
      }
    }),
  );

  sequelize.close();
})();
