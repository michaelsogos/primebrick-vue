// eslint-disable-next-line no-unused-vars
import { MenuItem } from "./MenuItem";
// eslint-disable-next-line no-unused-vars
import { View } from "./View";

export class OpenView {
	constructor() {
		/** @type {String} */
		this.viewName = null;
		/** @type {String} */
		this.icon = null;
		/** @type {String} */
		this.color = null;
		/** @type {Number} */
		this.entityId = null;
	}

	/**
	 *
	 * @param {MenuItem} menuItem
	 * @returns {OpenView}
	 */
	static fromMenuItem(menuItem) {
		const openView = new OpenView();
		openView.viewName = menuItem.viewName;
		openView.entityId = null;
		openView.icon = menuItem.icon;
		openView.color = menuItem.color;
		return openView;
	}

	/**
	 *
	 * @param {View} view
	 * @param {Number} entityId
	 * @returns {OpenView}
	 */
	static fromView(view, viewName, entityId) {
		const openView = new OpenView();
		openView.viewName = viewName || null;
		openView.entityId = entityId;
		openView.icon = view.icon;
		openView.color = view.color;
		return openView;
	}
}
