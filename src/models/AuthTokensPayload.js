export class AuthTokensPayload {
	constructor() {
		/** @type {String} */
		this.token_type = null;
		/** @type {Number} Expressed in seconds*/
		this.expires_in = null;
		/** @type {String} */
		this.access_token = null;
		/** @type {String} */
		this.refresh_token = null;
	}
}
