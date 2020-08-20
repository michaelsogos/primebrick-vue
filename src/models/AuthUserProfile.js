export class AuthUserProfile {
	constructor() {
		/** @type {String} */
		this.code = null;
		/** @type {String} */
		this.email = null;
		/** @type {String} */
		this.firstName = null;
		/** @type {String} */
		this.lastName = null;
		/** @type {String[]} */
		this.roles = [];
	}
}
