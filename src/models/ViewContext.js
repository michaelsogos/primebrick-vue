export class ViewContext {
	constructor() {
		/** @type {Number} */
		this.actionId = null;
		this.context = {
			/** @type {Boolean} */
			"json-enhance": false,
			user_id: {
				/** @type {Number} */
				$version: null,
				/** @type {String} */
				code: null,
				/** @type {String} */
				fullName: null,
				/** @type {Number} */
				id: 1,
			},
			/** @type {String} */
			_domain: null,
			/** @type {Number} */
			_id: null,
			/** @type {String} */
			_isCustomer: "true",
		};
		/** @type {String} */
		this.domain = null;
		/** @type {String} */
		this.icon = null;
		/** @type {String} */
		this.color = null;
		/** @type {String} */
		this.model = null;
		this.params = {
			/** @type {String} */
			limit: null,
			/** @type {String} */
			"search-filters": null,
		};
		/** @type {String} */
		this.title = null;
	}
}
