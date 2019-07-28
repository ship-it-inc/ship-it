import jsonWebToken from 'jsonwebtoken';
import { config } from 'dotenv';
import { SECRETKEY } from '../config/config';
import { ADMIN } from './constants';

config();

/**
 * @description This class is for JWT token authentication
 */
class JWTHelper {
  /**
   * @description This function generates the JWT tokens
   * @param {object} user the data of the user to authenticate
   * @param {string} duration time for token to expire
   * @returns {string} the token
   */
  static generateToken(user, duration) {
    const token = jsonWebToken.sign({ user }, SECRETKEY,
      {
        expiresIn: duration,
      });

    return token;
  }

  /**
   * @description This function verifies and decodes JWT tokens
   * @param {string} userToken
   * @returns {Object} userObject
   */
  static verifyToken(userToken) {
    if (!userToken || typeof userToken !== 'string') {
      throw new Error('Please enter a valid token.');
    }
    try {
      const decodedToken = jsonWebToken.verify(userToken, SECRETKEY);
      return decodedToken;
    } catch (err) {
      return err;
    }
  }

  /**
   * @description - handles the protection of some endpoints
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static authenticateUser(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed: Please supply a valid token.'
      });
    }
    try {
      const userToken = req.headers.authorization.split(' ')[1];
      const verifiedToken = JWTHelper.verifyToken(userToken);
      if (verifiedToken.name === 'JsonWebTokenError'
        || verifiedToken.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication failed: Please supply a valid token.'
        });
      }
      req.user = verifiedToken.user;
      return next();
    } catch (err) {
      return next(err);
    }
  }


  /**
   * @description protects endpoints for only admin
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next express next middleware
   * @returns {function} next
   */
  static authenticateAdmin(req, res, next) {
    if (req.user.role !== ADMIN) {
      return res.status(403).json({
        status: 'error',
        message: 'Authentication failed: You are not allowed to add orders.'
      });
    }
    return next();
  }
}

export default JWTHelper;
