// eslint-disable @typescript-eslint/no-explicit-any
import dotenv from 'dotenv';
// dotenv.config({ path: ".env.dev" });
dotenv.config({ path: ".env.production" });
import httpStatus from 'http-status';
import express, { Request, Response, NextFunction } from "express";
import { ValidationError } from 'express-validation';
import cors from 'cors';
import { apiRouter } from './api/router/index'
import db from "./connection/sequelize-config";
import APIError from './util/APIError';
import { ErrorType } from './api/dto/global.dto';

export async function createApp(): Promise<express.Application> {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.set('port', process.env.PORT);

  // Use process.env.NODE_ENV to determine the environment
  const environment = process.env.NODE_ENV || 'development';
  app.set('env', environment);

  app.use(express.json({ limit: '10mb', type: 'application/json' }));
  app.use(express.urlencoded({ extended: false }));

  app.use('/', apiRouter);
  db.sequelize.sync();

  app.get('/api', (req: Request, res: Response) => {
    return res.status(200).json({ message: '!You have successfully started the application!' });
  });

  // if error is not an instanceOf APIError, convert it txt.
  app.use((err: ErrorType | ValidationError, req: Request, res: Response, next: NextFunction) => {
    var error = err;

    if (err instanceof ValidationError) {
    const unifiedErrorMessage = err.error;
      // .map((error: { messages: any[]; }) => error.messages.join('. '))
       // .join(' and ');
      error = new APIError(unifiedErrorMessage, err.statusCode || httpStatus.BAD_REQUEST, true);
    } else if (err instanceof Error && err.name != APIError.name) {
      const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
      error = new APIError(err.msg, status, false);
    }
    return next(error);
  });

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new APIError("API not found", httpStatus.NOT_FOUND, true);
    return next(err);
  });

  // api error
  app.use((dataOrError: ErrorType, req: Request, res: Response, next: NextFunction) => {
    let status: number, body: any, msg: string;
    if (dataOrError.isError) {
      status = dataOrError.status;
      msg = dataOrError.isPublic && dataOrError.status != 500 ? dataOrError.msg  : httpStatus[dataOrError.status];
      body = { status, msg };
    } else {
      status = 200;
      msg = "Success";
      body = { status, msg, data: dataOrError };
    }

    res.status(status).json(body);
  });

  return app;
}