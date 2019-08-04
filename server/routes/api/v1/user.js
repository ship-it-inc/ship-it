import { Router } from 'express';

import User from '../../../controllers/user';
import JWTHelper from '../../../helpers/jwt';
import Validators from '../../../helpers/validators';

const userRouter = Router();


userRouter.get('/user/order',
  JWTHelper.authenticateUser,
  Validators.startAndEndDateValidator,
  User.getOrderHistory);

userRouter.get('/user/:id',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  Validators.startAndEndDateValidator,
  User.getOrderHistory);

export default userRouter;
