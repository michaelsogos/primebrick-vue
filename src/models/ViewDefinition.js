export class ViewDefinition {
  constructor() {
    /** @type {ViewField[]} */
    this.fields = [];
    /** @type {String} */
    this.perms = null;
    /** @type {View} */
    this.view = null;
  }
}

export class ViewField {
  constructor() {
    /** @type {Number} */
    this.defaultValue = null;
    /** @type {String} */
    this.name = null;
    /** @type {Boolean} */
    this.nameColumn = false;
    /** @type {Boolean} */
    this.orphan = false;
    /** @type {Boolean} */
    this.virtual = false;
    /** @type {Boolean} */
    this.readonly = false;
    /** @type {Boolean} */
    this.required = false;
    /** @type {String} */
    this.selection = null;
    /** @type {ViewFieldSelection[]} */
    this.selectionList = [];
    /** @type {String} */
    this.title = null;
    /** @type {String} */
    this.type = null;
    /** @type {String} */
    this.perms = null;
    /** @type {String} */
    this.target = null;
    /** @type {String} */
    this.targetName = null;
    /** @type {String[]} */
    this.targetSearch = [];
    /** @type {Boolean} */
    this.transient = false;
    /** @type {String} */
    this.mappedBy = null;
    /** @type {String} */
    this.enumType = null;
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

export class View {
  constructor() {
    /** @type {String} */
    this.model = null;
    /** @type {Number} */
    this.modelId = null;
    /** @type {String} */
    this.name = null;
    /** @type {String} */
    this.title = null;
    /** @type {String} */
    this.type = null;
    /** @type {Number} */
    this.viewId = null;
    /** @type {String} */
    this.xmlId = null;
  }
}
