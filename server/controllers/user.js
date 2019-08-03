import { Op } from 'sequelize';
import models from '../models';
import paginationHelper from '../helpers/paginationHelper';


/**
* @description class will implement functionalities for order history
*
* @class User
*/
class User {
  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async getOrderHistory(req, res, next) {
    const userId = req.user.id || req.params.id;
    const { Order } = models;
    const { limit, offset } = paginationHelper(req.query);
    try {
      const getOrderHistory = await Order.findAll({
        where: {
          userId,
          createdAt: {
            [Op.between]: [req.endDate, req.startDate]
          }
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit,
        offset
      });
      if (!getOrderHistory) {
        return res.status(404).send({
          success: false,
          message: 'No order history'
        });
      }
      return res.status(200).send({
        success: true,
        message: 'Order history retrieved successful',
        getOrderHistory
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default User;
