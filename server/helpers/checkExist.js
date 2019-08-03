
import models from '../models';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

/**
 * @description check the existence in db
 */
class checkExist {
  /**
   *
   * @description check if user exist in the db
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {*} error or next
   */
  static async checkUserIdExist(req, res, next) {
    try {
      const { User } = models;
      const userId = req.body.userId || req.params.id;
      if (!userId) {
        return res.status(400).send({
          status: 'error',
          message: 'please provide user id',
        });
      }
      if (!userId.match(uuidRegex)) {
        return res.status(400).send({
          status: 'error',
          message: 'invalid user id',
        });
      }
      const userExist = await User.findByPk(userId);
      if (!userExist) {
        return res.status(400).send({
          status: 'error',
          message: 'invalid user id',
        });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  }
}


export default checkExist;
