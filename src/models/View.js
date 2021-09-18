export class View {
    constructor() {
        //TODO: @mso -> For view that need an single entityId, instead place data here we should move it as specific PROPS of the view (eg: cards and grid don't need it)
        /** @type {Number} */
        this.entityId = null;
        /** @type {("grid"| "form"| "cards")} */
        this.type = null;
        /** @type {String} */
        this.version = null;
        /** @type {String} */
        this.name = null;
        /** @type {String} */
        this.labelKey = null;
        /** @type {String} */
        /** @type {String} */
        this.icon = null;
        /** @type {String} */
        this.color = null;
        /** @type {String} */
        this.brick = null;
        /** @type {ViewEntity} */
        this.entity = null;
        /** @type {Boolean} */
        this.showLogs = false;
        /** @type {ViewGridDefinition & ViewFormDefinition & ViewCardsDefinition} */
        this.definition = null;
        //TODO: @mso -> For view that need an READONLY flag, instead place data here we should move it as specific PROPS of the view (eg: cards and grid don't need it)
        /** @type {Boolean} */
        this.readonly = false;
        /** @type {String} */
        this.viewId = null;
    }
}

export class ViewEntity {
    constructor() {
        /** @type {String} */
        this.name = null;
        /** @type {String} */
        this.labelKey = null;
        /** @type {String} */
        this.recordNameTemplate = null;
    }
}

export class ViewDefinition {
    constructor() {
        /** @type {String[]} */
        this.perms = [];
    }
}

export class ViewListDefinition extends ViewDefinition {
    constructor() {
        super();
        /** @type {String & ("none"|"only"|"also")} */
        this.showArchivedEntities = null;
        /** @type {ViewFilter[]} */
        this.filters = [];
        /** @type {ViewSort[]} */
        this.sorts = [];
        /** @type {ViewOptions} */
        this.options = null;
        /** @type {ViewNameType[]} */
        this.alternativeViews = [];
        /** @type {ViewListActions} */
        this.actions = null;
        /** @type {ViewAggregator[]} */
        this.aggregators = [];
    }
}

export class ViewFormDefinition extends ViewDefinition {
    constructor() {
        super();
        /** @type {ViewContainer[]} */
        this.containers = [];
        /** @type {ViewFormActions} */
        this.actions = null;
    }
}

export class ViewGridDefinition extends ViewListDefinition {
    constructor() {
        super();
        /** @type {ViewColumnField[]} */
        this.fields = [];
        /** @type {ViewGridHighlighters[]} */
        this.highlighters = [];
    }
}

export class ViewCardsDefinition extends ViewListDefinition {
    constructor() {
        super();
        /** @type {ViewCardField[]} */
        this.fields = [];
        /** @type {ViewCardsActions} */
        this.actions = null;
        /** @type {ViewCardsOptions} */
        this.options = null;
        /** @type {ViewCardHighlighters[]} */
        this.highlighters = [];
    }
}

export class ViewAggregator {
    constructor() {
        /** @type {String} */
        this.expression = null;
        /** @type {ViewFilter[]} */
        this.filters = [];
        /** @type {String} */
        this.color = null;
        /** @type {String} */
        this.labelKey = null;
        this.excludeUIFilters = false;
        /** @type {Number} */
        this.value = null;
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
    }
}

export class ViewColumnField extends ViewField {
    constructor() {
        super();
        /** @type {Boolean} */
        this.isArchiveFlag = false;
        /** @type {Boolean} */
        this.hideColumn = false;
        /** @type {Boolean} */
        this.disableSort = false;
        /** @type {Boolean} */
        this.disableGroup = false;
    }
}

export class ViewCardField extends ViewField {
    constructor() {
        super();
        /** @type {Boolean} */
        this.isArchiveFlag = false;
        /** @type {ViewCardFieldLayout} */
        this.layout = null;
    }
}

export class ViewCardFieldLayout {
    constructor() {
        /** @type {Boolean} */
        this.isTitle = false;
        /** @type {Boolean} */
        this.isSubTitle = false;
        /** @type {Number} */
        this.line = null;
        /** @type {String[] & ("left"| "middle"|"right")[]} */
        this.filling = [];
        /** @type {("left"| "center"|"right")} */
        this.align = null;
        /** @type {Boolean} */
        this.isChip = false;
        /** @type {Boolean} */
        this.hideLabel = false;
        /** @type {Boolean} */
        this.isBold = false;
        /** @type {Boolean} */
        this.isDetail = false;
    }
}

export class ViewCardFieldFiller {
    constructor() {
        /** @type {Number} */
        this.position = null;
        /** @type {String } */
        this.value = null;
        /** @type {String } */
        this.label = null;
        /** @type {Number} */
        this.columnSize = null;
        /** @type {Number} */
        this.columnOffset = null;
        /** @type {String & ("left" | "right" | "center")} */
        this.align = null;
        /** @type {Boolean} */
        this.isChip = false;
        /** @type {Boolean} */
        this.hideLabel = false;
        /** @type {Boolean} */
        this.isBold = false;
        /** @type {Boolean} */
        this.isCheckBox = false;
    }
}

export class ViewContainerField extends ViewField {
    constructor() {
        super();
        /** @type {Number} */
        this.cols = null;
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
        /** @type {any} */
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
        this.delete = new ViewDeleteAction();
        this.archive = new ViewDeleteAction();

        this.refresh = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };
    }
}

export class ViewFilterAction {
    constructor() {
        /** @type {Boolean} */
        this.enableHeader = false;
        /** @type {Boolean} */
        this.enableDialog = false;
        /** @type {ViewFieldFilter[]} */
        this.fields = [];
    }
}

export class ViewSearchAction {
    constructor() {
        /** @type {Boolean} */
        this.enableToolbarButton = false;
        /** @type {String[]} */
        this.fields = [];
    }
}

export class ViewOpenAction {
    constructor() {
        /** @type {String} */
        this.view = null;
        /** @type {Boolean} */
        this.enableDoubleClick = false;
        /** @type {Boolean} */
        this.enableItemButton = false;
    }
}

export class ViewCardsOpenAction extends ViewOpenAction {
    constructor() {
        super();
        /** @type {Boolean} */
        this.enableTitleLink = false;
    }
}

export class ViewAddAction {
    constructor() {
        /** @type {String} */
        this.view = null;
        /** @type {Boolean} */
        this.enableToolbarButton = false;
        /** @type {Boolean} */
        this.enableFloatingButton = false;
        /** @type {Boolean} */
        this.enableMenuLink = false;
    }
}

export class ViewArchivedFilterAction {
    constructor() {
        /** @type {Boolean} */
        this.enableToolbarButton = false;
    }
}

export class ViewDeleteAction {
    constructor() {
        /** @type {Boolean} */
        this.enableToolbarButton = false;
        /** @type {Boolean} */
        this.enableMenuLink = false;
    }
}

export class ViewListDeleteAction extends ViewDeleteAction {
    constructor() {
        super();
        /** @type {Boolean} */
        this.enableItemButton = false;
    }
}

export class ViewListActions extends ViewActions {
    constructor() {
        super();
        this.open = new ViewOpenAction();
        this.edit = new ViewOpenAction();
        this.add = new ViewAddAction();
        this.delete = new ViewListDeleteAction();
        this.archivedFilter = new ViewArchivedFilterAction();
        this.restore = new ViewListDeleteAction();
        this.search = new ViewSearchAction();
        this.filter = new ViewFilterAction();
    }
}

export class ViewFormActions extends ViewActions {
    constructor() {
        super();

        this.save = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };

        this.info = {
            /** @type {Boolean} */
            enableToolbarButton: false,
            /** @type {Boolean} */
            enableMenuLink: false,
        };
    }
}

export class ViewCardsActions extends ViewListActions {
    constructor() {
        super();
        this.open = new ViewCardsOpenAction();
        this.edit = new ViewCardsOpenAction();
    }
}

export class ViewFieldFilter {
    constructor() {
        /** @type {String} */
        this.field = null;
        /** @type {String} */
        this.type = null;
        /** @type {String | string[]} The query expression value*/
        this.value = null;
        /** @type {String} The query expression operator (=, LIKE, etc.)*/
        this.operator = null;
        /** @type {ViewFieldFilterListOptions} */
        this.listOptions = null;
        /** @type {String} */
        this.label = null;
        //TODO: @mso -> This should be used instead of $refs
        /** @type {ViewFieldFilterViewModel} */
        this.viewModel = null;
    }
}

export class ViewFieldFilterViewModel {
    constructor() {
        /** @type {String|String[]} */
        this.selectedValue = null;
        /** @type {String} */
        this.selectedOperator = null;
    }
}

export class ViewOptions {
    constructor() {
        /** @type {Boolean} */
        this.enableMultiSelect = false;
        /** @type {Number} */
        this.itemsPerPage = 20;
    }
}

export class ViewCardsOptions extends ViewOptions {
    constructor() {
        super();
        /** @type {Boolean} */
        this.enableRecordNameAsTitle = false;
        /** @type {Boolean} */
        this.enableRecordNameAsSubTitle = false;
    }
}

export class ViewHighlighters {
    constructor() {
        /** @type {String} */
        this.expression = null;
    }
}

export class ViewGridHighlighters extends ViewHighlighters {
    constructor() {
        super();
        /** @type {String} */
        this.backgroundColor = null;
        /** @type {ViewHighlightersFont} */
        this.text = null;
    }
}

export class ViewCardHighlighters extends ViewHighlighters {
    constructor() {
        super();
        /** @type {ViewHighlightersBorder} */
        this.border = null;
        /** @type {ViewHighlightersFont} */
        this.title = null;
        /** @type {ViewHighlightersIcon} */
        this.icon = null;
    }
}

export class ViewHighlightersFont {
    constructor() {
        /** @type {String} */
        this.color = null;
        /** @type {String & ("black" | "bold"| "medium" | "regular"|"light"|"thin")} */
        this.weight = null;
        /** @type {String & ("none" | "line-through"| "overline" | "underline")} */
        this.style = null;
        /** @type {Boolean} */
        this.italic = null;
    }
}

export class ViewHighlightersIcon {
    constructor() {
        /** @type {String} */
        this.color = null;
        /** @type {String} */
        this.name = null;
    }
}

export class ViewHighlightersBorder {
    constructor() {
        /** @type {(String & ("left" | "top"| "right" | "bottom"))[]} */
        this.sides = null;
        /** @type {Number} */
        this.size = 5;
        /** @type {String} */
        this.color = "#607D8B";
    }
}

export class ViewFieldFilterListOptions {
    constructor() {
        /** @type {Boolean} */
        this.enableMultiSelection = null;
        /** @type {ViewFieldFilterListValue[]} */
        this.values = [];
        /** @type {ViewFieldFilterListQuery} */
        this.query = null;
    }
}

export class ViewFieldFilterListValue {
    constructor() {
        /** @type {String} */
        this.labelKey = null;
        /** @type {any} */
        this.value = null;
        /** @type {String} */
        this.text = null;
    }
}

export class ViewFieldFilterListQuery {
    constructor() {
        /** @type {String} */
        this.brick = null;
        /** @type {String} */
        this.entity = null;
        /** @type {String} */
        this.valueFieldName = null;
        /** @type {String} */
        this.labelKeyFieldName = null;
        /** @type {String} */
        this.textFieldName = null;
        /** @type {Boolean} */
        this.loading = false;
        /** @type {String[]} */
        this.searchFields = [];
        /** @type {ViewFieldFilterListQueryResultItem[]} */
        this.queryResultItems = [];
        /** @type {Number} */
        this.queryResultCount = null;
        /** @type {String & ('none' | 'only' | 'also')} */
        this.showArchivedEntities = null;
        /** @type {ViewFilter[]} */
        this.filters = [];
        /** @type {ViewSort[]} */
        this.sorts = [];
        /** @type {Boolean} */
        this.error = false;
    }
}

export class ViewFieldFilterListQueryResultItem {
    constructor() {
        /** @type {String} */
        this.text = null;
        /** @type {any} */
        this.value = null;
    }
}
