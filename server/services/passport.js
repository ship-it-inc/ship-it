import passport from 'passport';
import GoogleLogin from '../controllers/googleLogin';

export default (app) => {
  app.use(passport.initialize());
  GoogleLogin.googleStrategy();
};
