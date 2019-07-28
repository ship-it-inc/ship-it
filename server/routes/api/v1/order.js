import { Router } from 'express';

import Orders from '../../../controllers/order';
import JWTHelper from '../../../helpers/jwt';

const orderRouter = Router();


orderRouter.post('/order',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  Orders.addOrder);


export default orderRouter;
