/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';
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
import { checkJson } from './middlewares/checkJson';

import { Error } from './types';

const app = express();
const server = http.createServer(app);

(async () => {
  await database();

  app.use(morgan(devEnv() ? 'dev' : 'combined'));

  morgan.token('username', (req) => (req.permissions ? req.permissions : 'anonymous'));
  morgan.token('ip', (req) => req.header('x-forwarded-for') || req.connection.remoteAddress);

  if (!devEnv()) {
    app.use(
      morgan(':ip - :username - [:date[clf]] :method :status :url - :response-time ms', {
        stream: fs.createWriteStream(`logs/access.log`, { flags: 'a' }),
        skip: (req) => req.method === 'OPTIONS' || req.method === 'GET',
      }),
    );
  }

  // Security middlewares
  app.use(cors(), helmet());

  // Body middlewares
  app.use(checkContent(), bodyParser.json(), checkJson());

  app.use(routes());

  app.use((req: Request, res: Response) => notFound(res, Error.ROUTE_NOT_FOUND));

  server.listen(process.env.APP_PORT, () => {
    log.info(`Node environment: ${process.env.NODE_ENV}`);
    log.info(`Listening on ${process.env.APP_PORT}...`);
  });
})();
