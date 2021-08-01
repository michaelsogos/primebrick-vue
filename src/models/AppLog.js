export class AppLog {
    /**
     *
     * @param {Number} severity
     * @param {String} message
     */
    constructor(severity, message) {
        /** @type {Number} */
        this.severity = severity;
        /** @type {String} */
        this.message = message;
        this.raisedOn = new Date();
    }
}
