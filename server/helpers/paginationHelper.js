import { DEFAULT_LIMIT, DEFAULT_PAGE } from './constants';
/**
 * @param {object} query
 * @returns {object} - method that help handle pagination limit and offset
 */
const paginationHelper = (query) => {
  const page = Number(query.page) || DEFAULT_PAGE;
  const limit = Number(query.limit) || DEFAULT_LIMIT;
  const offset = limit * (page - 1);
  return { limit, offset };
};

export default paginationHelper;
