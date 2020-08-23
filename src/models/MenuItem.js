export class MenuItem {
	constructor() {
		/** @type {String} */
		this.labelKey = null;
		/** @type {String} */
		this.icon = null;
		/** @type {String} */
		this.color = null;
		/** @type {String} */
		this.viewName = null;
		/** @type {Number} */
		this.orderPriority = 0;
		/** @type {MenuItem[]} */
		this.children = null;
		/** @type {String[]} */
		this.roles = null;
	}
}
