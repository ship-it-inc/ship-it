/* eslint-disable no-unreachable */


/**
 * @description validation class
 */
class Validators {
  /**
     *
     * @param {object} date - date object
     * @returns {Bool} - returns true or false
     */
  static dateValidator(date) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
    return true;
  }

  /**
   *
   * @param {*} req request object
   * @param {*} res  response object
   * @param {*} next next middleware
   * @returns {*} next middleware
   */
  static startAndEndDateValidator(req, res, next) {
    const start = req.query.start || new Date().toISOString();
    if (!Validators.dateValidator(start)) {
      return res.status(400).send({
        status: 'error',
        message: 'invalid start date parameter',
      });
    }
    const end = req.query.end
    || new Date(new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 7).toISOString();
    if (!Validators.dateValidator(end)) {
      return res.status(400).send({
        status: 'error',
        message: 'invalid end date parameter',
      });
    }
    req.startDate = start;
    req.endDate = end;

    return next();
  }
}

export default Validators;
