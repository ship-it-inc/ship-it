
import passport from 'passport';
import googleStrategyOauth2 from 'passport-google-oauth';
import models from '../models';
import { SUBSCRIBER } from '../helpers/constants';
import JWTHelper from '../helpers/jwt';

/**
 * @description A class that implements google login
 */
export default class GoogleLogin {
  /**
  * @description Setup google authentication
  * @returns {object} passport
  */
  static googleStrategy() {
    const GoogleStrategy = googleStrategyOauth2.OAuth2Strategy;
    passport.use(
      new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      }, GoogleLogin.googleStrategyCallback)
    );
  }

  /**
  * @description callback for google strategy
  * @param {string} accessToken - google access token
  * @param {string} refreshToken - google refresh token
  * @param {object} profile - profile of the user
  * @param {object} done - called after completion
  * @returns {object} passport
  */
  static async googleStrategyCallback(accessToken, refreshToken,
    profile, done) {
    const userData = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profile,
    };
      const { email } = userData;
      const { User } = models;
      User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: SUBSCRIBER,
        }
      }).spread((user, created) => {
        const duration = '25d';
        const token = JWTHelper.generateToken(user, duration);
        userData.token = token;
        userData.isNewUser = created;
        userData.userId = user.id;
        done(null, userData);
      })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @description Google social login callback
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {function} Anonymous
   */
  static async googleCallback(req, res) {
    const {
      user: { token }, user: { isNewUser }, user: { wrongEmail }, user: { userId }
    } = req;
    if (wrongEmail) {
      return res.status(403).json({
        success: false,
        message: 'You can only login with an Andela email',
      });
    }
    if (isNewUser) {
      const { Subscription } = models;
      await Subscription.create({
        userId,
        amount: 0,
      });
      return res.status(201).json({
        status: 'success',
        message: 'Registration Successful',
        token,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Login Successful',
      token,
    });
  }
}
