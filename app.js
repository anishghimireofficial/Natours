import express from 'express';

import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

export default app;
