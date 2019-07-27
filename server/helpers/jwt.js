import jsonWebToken from 'jsonwebtoken';
import { config } from 'dotenv';
import { SECRETKEY } from '../config/config';

config();

/**
 * @description This class is for JWT token generation and verification
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
}

export default JWTHelper;
