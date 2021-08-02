export class View {
    constructor() {
        /** @type {Number} */
        this.entityId = null;
        /** @type {String} */
        this.name = null;
        /** @type {String} */
        this.labelKey = null;
        /** @type {String} */
        this.entityNameLabelKey = null;
        /** @type {String} */
        this.icon = null;
        /** @type {String} */
        this.color = null;
        /** @type {ViewGridDefinition | ViewFormDefinition} */
        this.definition = null;
        /** @type {ViewNameType[]} */
        this.alternativeViews = [];
        /** @type {ViewActions} */
        this.actions = null;
        /** @type {ViewOptions} */
        this.options = null;
        /** @type {ViewHighlighters[]} */
        this.highlighters = [];
        /** @type {Boolean} */
        this.readonly = false;
    }
}

export class ViewDefinition {
    constructor() {
        /** @type {String} */
        this.brick = null;
        /** @type {String} */
        this.entity = null;
        /** @type {String} */
        this.type = null;
        /** @type {String} */
        this.entityNameTemplate = null;
        /** @type {String[]} */
        this.perms = [];
        /** @type {String} */
        this.showArchivedEntities = null;
    }
}

export class ViewFormDefinition extends ViewDefinition {
    constructor() {
        super();
        /** @type {ViewContainer[]} */
        this.containers = [];
    }
}

export class ViewGridDefinition extends ViewDefinition {
    constructor() {
        super();
        /** @type {ViewField[]} */
        this.fields = [];
        /** @type {ViewFilter[]} */
        this.filters = [];
        /** @type {ViewSort[]} */
        this.sorts = [];
    }
}

export class ViewContainer {
    constructor() {
        /** @type {Number} */
        this.cols = null;
        /** @type {String} */
        this.showTitle = null;
        /** @type {ViewContainerField[]} */
        this.fields = [];
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
        /** @type {String} */
        this.type = null;
        /** @type {Boolean} */
        this.hideColumn = false;
        /** @type {Boolean} */
        this.isArchiveFlag = false;
    }
}

export class ViewContainerField extends ViewField {
    constructor() {
        super();
        /** @type {Number} */
        this.cols = null;
        /** @type {Boolean} */
        this.require = false;
        /** @type {ViewValidation[]} */
        this.validationRules = [];
        /** @type {Boolean} */
        this.translatable = false;
    }
}

export class ViewValidation {
    constructor() {
        /** @type {String} */
        this.rule = null;
        /** @type {String} */
        this.labelKey = null;
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
        /** @type {any} */
        this.expressionValues = null;
    }
}

export class ViewActions {
    constructor() {
        this.open = {
            /** @type {String} */
            view: null,
            /** @type {Boolean} */
            enableDoubleClick: false,
            /** @type {Boolean} */
            enableRowButton: false,
        };

        this.save = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.edit = {
            //-- FOR GRID
            /** @type {String} */
            view: null,
            /** @type {Boolean} */
            enableDoubleClick: false,
            /** @type {Boolean} */
            enableRowButton: false,
            //-- FOR FORM
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.add = {
            /** @type {String} */
            view: null,
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableFloatingButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.delete = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableRowButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.archive = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableRowButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.refresh = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.search = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {String[]} */
            fields: [],
        };

        this.filter = {
            /** @type {Boolean} */
            enableColumns: false,
            /** @type {Boolean} */
            enableDialog: false,
            /** @type {ViewFilterField[]} */
            fields: [],
        };

        this.showArchived = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.restore = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableRowButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };
    }
}

export class ViewFilterField {
    constructor() {
        /** @type {String} */
        this.field = null;
        /** @type {String} */
        this.type = null;
        /** @type {String} */
        this.value = null;
        /** @type {String} */
        this.operator = null;
    }
}

export class ViewOptions {
    constructor() {
        /** @type {Boolean} */
        this.enableMultiSelect = false;
        /** @type {Boolean} */
        this.showLogs = false;
    }
}

export class ViewHighlighters {
    constructor() {
        /** @type {String} */
        this.expression = null;
        /** @type {String} */
        this.backgroundColor = null;
        /** @type {String} */
        this.fontColor = null;
        /** @type {String} */
        this.fontWeight = null;
        /** @type {String} */
        this.fontStyle = null;
        /** @type {Boolean} */
        this.fontItalic = false;
    }
}
