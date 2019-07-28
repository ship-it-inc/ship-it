import { Router } from 'express';

import authRouter from './auth';
import testRouter from './pay';

const v1Router = Router();

v1Router.use('/api/v1', authRouter);
v1Router.use('/api/v1', testRouter);

export default v1Router;
