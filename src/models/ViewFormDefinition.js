// import { ViewDefinition, View } from "./View";

// export class ViewFormDefinition extends ViewDefinition {
// 	constructor() {
// 		super();
// 		/** @type {ViewForm} */
// 		this.view = null;
// 	}
// }

// export class ViewForm extends View {
// 	constructor() {
// 		super();
// 		/** @type {String} */
// 		this.canDelete = null;
// 		/** @type {String} */
// 		this.canEdit = null;
// 		/** @type {String} */
// 		this.canSave = null;
// 		/** @type {String} */
// 		this.onLoad = null;
// 		/** @type {String} */
// 		this.onNew = null;
// 		/** @type {String} */
// 		this.width = null;
// 		/** @type {ViewNestedFormDefinition[]} */
// 		this.items = [];
// 	}
// }

// export class ViewNestedFormDefinition {
// 	constructor() {
// 		/** @type {String} */
// 		this.name = null;
// 		/** @type {String} */
// 		this.type = null;
// 		/** @type {ViewNestedForm} */
// 		this.view = null;
// 	}
// }

// export class ViewNestedForm extends View {
// 	constructor() {
// 		super();
// 		/** @type {ViewMenuBar[]} */
// 		this.menubar = [];
// 		/** @type {ViewToolbarItem[]} */
// 		this.toolbar = [];
// 		/** @type {ViewFormPanel[]} */
// 		this.items = [];
// 	}
// }

// export class ViewMenuBar {
// 	constructor() {
// 		/** @type {String} */
// 		this.icon = null;
// 		/** @type {Boolean} */
// 		this.showTitle = false;
// 		/** @type {String} */
// 		this.title = null;
// 		/** @type {String} */
// 		this.type = null;
// 		/** @type {ViewMenuBarItem[]} */
// 		this.item = [];
// 	}
// }

// export class ViewMenuBarItem {
// 	constructor() {
// 		/** @type {String} */
// 		this.action = null;
// 		/** @type {String} */
// 		this.title = null;
// 		/** @type {String} */
// 		this.type = null;
// 	}
// }

// export class ViewToolbarItem {
// 	constructor() {
// 		/** @type {String} */
// 		this.name = null;
// 		/** @type {String} */
// 		this.onClick = null;
// 		/** @type {String} */
// 		this.showIf = null;
// 		/** @type {String} */
// 		this.title = null;
// 		/** @type {String} */
// 		this.type = null;
// 	}
// }

// export class ViewFormPanel {
// 	constructor() {
// 		/** @type {String} */
// 		this.icon = null;
// 		/** @type {String} */
// 		this.iconBackground = null;
// 		/** @type {ViewFormField[]} */
// 		this.items = [];
// 		/** @type {String} */
// 		this.name = null;
// 		/** @type {String} */
// 		this.showIf = null;
// 		/** @type {Boolean} */
// 		this.showTitle = false;
// 		/** @type {Boolean} */
// 		this.stacked = false;
// 		/** @type {String} */
// 		this.title = null;
// 		/** @type {String} */
// 		this.type = null;
// 	}
// }

// export class ViewFormField {
// 	constructor() {
// 		/** @type {String} */
// 		this.autoTitle = null;
// 		/** @type {Boolean} */
// 		this.hidden = false;
// 		/** @type {String} */
// 		this.name = null;
// 		/** @type {Boolean} */
// 		this.readonly = false;
// 		/** @type {String} */
// 		this.type = null;
// 		/** @type {Number} */
// 		this.colSpan = null;
// 		/** @type {Boolean} */
// 		this.showTitle = false;
// 		/** @type {ViewFormViewer[]} */
// 		this.viewer = [];
// 		/** @type {ViewFormButtons[]} */
// 		this.items = [];
// 	}
// }

// export class ViewFormViewer {
// 	constructor() {
// 		/** @type {String} */
// 		this.template = null;
// 		/** @type {String} */
// 		this.type = null;
// 	}
// }

// export class ViewFormButtons {
// 	constructor() {
// 		/** @type {Number} */
// 		this.colOffset = null;
// 		/** @type {Number} */
// 		this.colSpan = null;
// 		/** @type {String} */
// 		this.icon = null;
// 		/** @type {String} */
// 		this.name = null;
// 		/** @type {String} */
// 		this.onClick = null;
// 		/** @type {String} */
// 		this.title = null;
// 		/** @type {String} */
// 		this.type = null;
// 	}
// }
