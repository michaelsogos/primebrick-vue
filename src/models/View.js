export class View {
	constructor() {
		/** @type {String} */
		this.name = null;
		/** @type {String} */
		this.labelKey = null;
		/** @type {String} */
		this.icon = null;
		/** @type {String} */
		this.color = null;
		/** @type {ViewDefinition} */
		this.definition = null;
		/** @type {ViewNameType[]} */
		this.alternativeViews = [];
		/** @type {ViewActions} */
		this.actions = null;
	}
}

export class ViewDefinition {
	constructor() {
		/** @type {String} */
		this.entity = null;
		/** @type {Number} */
		this.entityId = null; //TODO: @michaelsogos -> Move to context
		/** @type {String} */
		this.type = null;
		/** @type {ViewField[]} */
		this.fields = [];
		/** @type {ViewSort[]} */
		this.sorts = [];
		/** @type {String[]} */
		this.perms = [];
		/** @type {ViewFilter[]} */
		this.filters = [];
	}
}

export class ViewField {
	constructor() {
		/** @type {String} */
		this.name = null;
		/** @type {String} */
		this.labelKey = null;
		/** @type {String[]} */
		this.perms = [];

		/** @type {Number} */
		// this.defaultValue = null;
		/** @type {Boolean} */
		// this.nameColumn = false;
		/** @type {Boolean} */
		// this.orphan = false;
		/** @type {Boolean} */
		// this.virtual = false;
		/** @type {Boolean} */
		// this.readonly = false;
		/** @type {Boolean} */
		// this.required = false;
		/** @type {String} */
		// this.selection = null;
		/** @type {ViewFieldSelection[]} */
		// this.selectionList = [];
		/** @type {String} */
		// this.type = null;
		/** @type {String} */
		// this.target = null;
		/** @type {String} */
		// this.targetName = null;
		/** @type {String[]} */
		// this.targetSearch = [];
		/** @type {Boolean} */
		// this.transient = false;
		/** @type {String} */
		// this.mappedBy = null;
		/** @type {String} */
		// this.enumType = null;
	}
}

export class ViewFieldSelection {
	constructor() {
		/** @type {Any} */
		this.data = null;
		/** @type {Boolean} */
		this.hidden = false;
		/** @type {String} */
		this.icon = null;
		/** @type {Number} */
		this.order = null;
		/** @type {String} */
		this.title = null;
		/** @type {String} */
		this.value = null;
	}
}

export class ViewSort {
	constructor() {
		/** @type {String} */
		this.field = null;
		/** @type {String} */
		this.direction = null;
	}
}

export class ViewNameType {
	constructor() {
		/** @type {String} */
		this.name = null;
		/** @type {String} */
		this.type = null;
	}
}

export class ViewFilter {
	constructor() {
		/** @type {String} */
		this.leftOperator = null;
		/** @type {String} */
		this.expressionOperator = null;
		/** @type {String[]} */
		this.expressions = [];
	}
}

export class ViewActions {
	constructor() {
		this.onEdit = {
			/** @type {String} */
			view: null,
			/** @type {Boolean} */
			enableToolbar: false,
			/** @type {Boolean} */
			enableDoubleClick: false,
			/** @type {Boolean} */
			enableRowButton: false,
			/** @type {Boolean} */
			enableMenu: false,
		};

		this.onDelete = {
			/** @type {Boolean} */
			enableToolbar: false,
			/** @type {Boolean} */
			enableRowButton: false,
			/** @type {Boolean} */
			enableMenu: false,
		};

		this.onArchive = {
			/** @type {Boolean} */
			enableToolbar: false,
			/** @type {Boolean} */
			enableRowButton: false,
			/** @type {Boolean} */
			enableMenu: false,
		};
	}
}
