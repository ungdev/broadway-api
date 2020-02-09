import express, { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import database from './database';
import { notFound } from './utils/responses';
import routes from './controllers';
import log from './utils/log';
import { devEnv } from './utils/env';
import checkContent from './middlewares/checkContent';

const app = express();
const server = http.createServer(app);

config();

(async () => {
  await database();

  app.use(morgan(devEnv() ? 'dev' : 'combined'));

  morgan.token('username', (req) => (req.permissions ? req.permissions : 'anonymous'));
  morgan.token('ip', (req) => req.header('x-forwarded-for') || req.connection.remoteAddress);

  if (!devEnv()) {
    app.use(
      morgan(':ip - :username - [:date[clf]] :method :status :url - :response-time ms', {
        stream: fs.createWriteStream(`${process.env.APP_PATH_LOGS}/access.log`, { flags: 'a' }),
        skip: (req) => req.method === 'OPTIONS' || req.method === 'GET',
      }),
    );
  }

  app.use(checkContent());
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());

  app.use(routes());

  app.use((req: Request, res: Response) => notFound(res));

  server.listen(process.env.APP_PORT, () => {
    log.info(`Node environment: ${process.env.NODE_ENV}`);
    log.info(`Listening on ${process.env.APP_PORT}...`);
  });
})();
