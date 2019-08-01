import { Router } from 'express';

import Orders from '../../../controllers/order';
import JWTHelper from '../../../helpers/jwt';
import Validators from '../../../helpers/validators';

const orderRouter = Router();


orderRouter.post('/order',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  Orders.addOrder);

orderRouter.get('/order/all',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  Validators.startAndEndDateValidator,
  Orders.allOrders);

export default orderRouter;
