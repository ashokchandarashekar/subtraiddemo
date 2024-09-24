import httpStatus from 'http-status';


/**
 * Class representing an API error.
 * @extends Error
 */
export default class APIError extends Error {
  /**
   * Creates an API error.
   * @param {string} msg - Error msg.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the msg should be visible to user or not.
   */

  name: string;
  msg: string;
  status: number;
  isPublic: boolean;
  isError: boolean;

  constructor(msg: string, status: number = httpStatus.INTERNAL_SERVER_ERROR, isPublic: boolean = false) {
    super(msg);
    this.name = APIError.name;
    this.msg = msg;
    this.status = status;
    this.isPublic = isPublic
    this.isError = true;
  }
}

module.exports = APIError;