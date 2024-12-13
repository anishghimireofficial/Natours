import express from 'express';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import morgan from 'morgan';

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

//Handling all unHandles Routes with Error Handling.
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!.`);
  err.status = 'Fail 💥💥💥';
  err.statusCode = 404;

  next(err);
});

// app.use('/api/v1/users', userRouter);

//Error Handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next();
});

export default app;
