import { Router } from 'express';
import UserController from '../../../controllers/user';
import JWTHelper from '../../../helpers/jwt';
import Validators from '../../../helpers/validators';

const userRouter = Router();


userRouter.get('/user/order',
  JWTHelper.authenticateUser,
  Validators.startAndEndDateValidator,
  UserController.getOrderHistory);

userRouter.get('/user/:id',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  Validators.startAndEndDateValidator,
  UserController.getOrderHistory);

userRouter.get('/users/all',
  JWTHelper.authenticateUser,
  JWTHelper.authenticateAdmin,
  UserController.getAllUser);

userRouter.get('/balance',
  JWTHelper.authenticateUser,
  UserController.getUserBalance);


export default userRouter;
