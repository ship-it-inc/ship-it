import { Op } from 'sequelize';
import models from '../models';
import paginationHelper from '../helpers/paginationHelper';
import { ORDER_AMOUNT } from '../helpers/constants';

/**
* @description class will implement CRUD functionalities for articles
*
* @class Orders
*/
class Orders {
  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async addOrder(req, res, next) {
    try {
      const { userId, description, orderType } = req.body;
      const { Order, Subscription } = models;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const orderExist = await Order.findOne({
        where: {
          userId,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }

        }
      });
      if (orderExist) {
        return res.status(409).send({
          status: 'error',
          message: 'The user already have an order for today',
        });
      }
      const userOrder = await Order.create({
        userId,
        description,
        amount: ORDER_AMOUNT[orderType]
      });

      await Subscription.decrement(
        { amount: ORDER_AMOUNT[orderType] },
        { where: { userId } }
      );
      return res.status(201).send({
        status: 'success',
        message: 'Order added successfully',
        userOrder
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description get all orders that have been made
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async allOrders(req, res, next) {
    try {
      const { Order } = models;
      const { limit, offset } = paginationHelper(req.query);
      const allOrders = await Order.findAll({
        where: {
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
      return res.status(200).send({
        status: 'success',
        message: 'Order fetched successfully',
        allOrders
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default Orders;
