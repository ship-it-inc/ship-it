import { Op } from 'sequelize';
import models from '../models';
import paginationHelper from '../helpers/paginationHelper';
import { startOfDay, endOfDay } from '../helpers/dateRange';


/**
* @description class will implement functionalities for user
*
* @class User
*/
class UserController {
  /**
   * @description get user order history
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

  /**
   * @description get all the users of the app
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async getAllUser(req, res, next) {
    try {
      const { User, Order } = models;
      const allUsers = await User.findAll({
        include: [
          {
            model: Order,
            as: 'order',
            required: false,
            where: {
              createdAt: {
                [Op.between]: [startOfDay(), endOfDay()]
              }
            },
          }

        ],

      });
      return res.status(200).send({
        success: true,
        message: 'Users retrieved successful',
        allUsers
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description get the user balance
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async getUserBalance(req, res, next) {
    try {
      const { Subscription } = models;
      const userId = req.user.id || req.params.id;
      let userBalance = await Subscription.findOne({
        where: {
          userId
        }
      });
      userBalance = userBalance.amount || 0;
      return res.status(200).send({
        success: true,
        message: 'Balance retrieved successful',
        userBalance
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description get the count of user orders
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async getUserOrderCount(req, res, next) {
    try {
      const { Order } = models;
      const userId = req.user.id || req.params.id;
      const ordersCount = await Order.count({
        where: {
          userId
        }
      });
      return res.status(200).send({
        success: true,
        message: 'User order counts retrieved successful',
        ordersCount
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;
