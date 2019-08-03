import { Router } from 'express';

import authRouter from './auth';
import testRouter from './pay';
import orderRouter from './order';
import userRouter from './user';

const v1Router = Router();

v1Router.use('/api/v1', authRouter);
v1Router.use('/api/v1', testRouter);
v1Router.use('/api/v1', orderRouter);
v1Router.use('/api/v1', userRouter);

export default v1Router;
