import express from 'express';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErrorHandler from './utils/errorController.js';

import tourRouter from './routes/tourRoutes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

//Handling all unHandles Routes with Error Handling.

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!.`, 404));
});

//Error Handling
app.use(globalErrorHandler);

export default app;
