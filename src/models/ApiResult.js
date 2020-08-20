export class ApiResult {
  constructor() {
    /** @type {Boolean} */
    this.hasError = false;
    /** @type {String} */
    this.clientMessage = null;
    /** @type {Error} */
    this.exception = null;
    /** @type {Object} */
    this.response = null;
  }
}
