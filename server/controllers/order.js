import models from '../models';
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
}

export default Orders;
