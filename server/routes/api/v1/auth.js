import { Router } from 'express';
import passport from 'passport';

import GoogleLogin from '../../../controllers/googleLogin';

const authRouter = Router();


authRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }), GoogleLogin.googleCallback
);

export default authRouter;
