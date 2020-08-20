export class DrawerItem {
	constructor() {
		/** @type {String} */
		this.viewName = null;
		/** @type {Number} */
		this.id = null;
		/** @type {String} */
		this.labelKey = null;
		/** @type {DrawerItem[]} */
		this.items = [];
		/** @type {String} */
		this.icon = null;
		/** @type {String} */
		this.color = null;
		/** @type {String} */
		this.baseIcon = null;
		/** @type {String} */
		this.baseColor = null;
	}
}
