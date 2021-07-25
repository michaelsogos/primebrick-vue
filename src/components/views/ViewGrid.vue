/* eslint-disable vue/no-parsing-error */
<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0">
        <h-panel>
            <template v-slot:header>
                <h-view-toolbar
                    :view="view"
                    @delete="onDeleteItems"
                    @archive="onArchiveItems"
                    @refresh="onRefresh"
                    @search="onSearch"
                ></h-view-toolbar>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-btn
                :color="view.color || 'tertiary'"
                fab
                absolute
                dark
                bottom
                right
                style="bottom: 50px"
                @click="onAddItem()"
                v-if="checkFabButtonVisibility()"
                :title="this.$options.filters.translate('add-new-record')"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-data-table
                :headers="gridHeaders"
                :items="gridRecords"
                :items-per-page="50"
                item-key="id"
                :item-class="rowStyle"
                fixed-header
                dense
                height="100%"
                class="d-flex flex-column fill-height"
                :server-items-length="gridTotal"
                :footer-props="{
                    showFirstLastPage: true,
                    itemsPerPageOptions: [50],
                }"
                @update:page="onPageChange"
                @update:sort-by="onSortField"
                @update:sort-desc="onSortDescendant"
                @dblclick:row="onDoubleClickRow"
                @click:row="onClickRow"
                :loading="viewDataLoading"
                show-group-by
                show-select
                :single-select="!getGridOption('enableMultiSelect')"
                v-model="viewSelectedRows"
            >
                <template v-slot:[`body.prepend`]="{ headers }">
                    <tr class="v-data-table__empty-wrapper" v-if="checkColumnFiltersVisibility()">
                        <td v-for="(item, idx) in headers" :key="idx" class="pa-0 ma-0">
                            <template v-if="checkFilterFieldVisibility(item, 'string')">
                                <v-row no-gutters>
                                    <v-col cols="2">
                                        <v-select
                                            hide-details
                                            solo
                                            flat
                                            dense
                                            :ref="`filter-operator-${item.value}`"
                                            :items="stringFilterOperators"
                                            value="CONTAINS"
                                            class="filter-input"
                                            @change="onFilterField(item)"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-text-field
                                            hide-details
                                            solo
                                            flat
                                            dense
                                            clearable
                                            type="text"
                                            :label="item.value"
                                            class="filter-input"
                                            :ref="`filter-input-${item.value}`"
                                            @change="onFilterField(item)"
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon small>mdi-filter</v-icon>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-if="checkFilterFieldVisibility(item, 'list')">
                                <v-row no-gutters>
                                    <v-col>
                                        <v-select
                                            hide-details
                                            solo
                                            flat
                                            dense
                                            :ref="`filter-input-${item.value}`"
                                            :items="['df', 'dss', 'sfdfsf', 'ddghh']"
                                            value="df"
                                            class="filter-input"
                                            clearable
                                            @change="onFilterField(item)"
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon small>mdi-filter</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-if="checkFilterFieldVisibility(item, 'search')">
                                <v-row no-gutters>
                                    <v-col>
                                        <!-- TODO: @michaelsogos -> Implement remote query -->
                                        <v-autocomplete
                                            hide-details
                                            solo
                                            flat
                                            dense
                                            :ref="`filter-input-${item.value}`"
                                            class="filter-input"
                                            :items="['df', 'dss', 'sfdfsf', 'ddghh', 'it']"
                                            hide-selected
                                            label="Public APIs"
                                            @change="onFilterField(item)"
                                            return-object
                                            clearable
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon small>mdi-filter</v-icon>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                </v-row>
                            </template>
                        </td>
                    </tr>
                </template>

                <template v-for="boolColumn in getBooleanColumns" v-slot:[`item.${boolColumn}`]="{ item }">
                    <v-simple-checkbox v-model="item[boolColumn]" disabled :key="boolColumn"></v-simple-checkbox>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="actionsCell">
                        <v-icon v-if="checkRowButtonVisibility('open')" small class="mr-2" color="primary" @click.stop="onOpenItem(item)">
                            mdi-eye
                        </v-icon>
                        <v-icon v-if="checkRowButtonVisibility('edit')" small color="primary" class="mr-2" @click.stop="onEditItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon v-if="checkRowButtonVisibility('delete')" small class="mr-2" color="error" @click="onDeleteItem(item)">
                            mdi-delete-alert
                        </v-icon>
                        <v-icon v-if="checkRowButtonVisibility('archive')" small class="mr-2" color="error" @click="onArchiveItem(item)">
                            mdi-trash-can
                        </v-icon>
                    </div>
                </template>
            </v-data-table>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { LowLevelUtils } from "../../common/LowLevelUtils";
import { View, ViewSort, ViewFilter, ViewFilterField } from 'src/models/View';
import { Query } from 'src/models/Query';
import { OpenView } from 'src/models/OpenView';
import { ConfirmDialog } from '../../models/ConfirmDialog';
import { StringUtils } from "../../common/StringUtils";

export default {
    name: "view-grid",
    props: {
        view: View,
    },
    data: function () {
        return {
            /** @type {import ("../../models/View").ViewGridDefinition} */
            viewDefinition: this.view.definition,
            /** @type {import("../../models/QueryResult").QueryResult} */
            viewData: null,
            viewDataLoading: false,
            viewDataPageNumber: 1,
            viewDataSortFields: [],
            viewDataSortDirections: [],
            viewSelectedRows: [],
            viewSearchTerm: null,
            /** @type {ViewFilterField[]} */
            viewColumnFilters: [],
            stringFilterOperators: [
                {
                    text: this.$options.filters.translate("contains"),
                    value: "CONTAINS"
                },
                {
                    text: this.$options.filters.translate("starts-with"),
                    value: "STARTSWITH"
                },
                {
                    text: this.$options.filters.translate("ends-with"),
                    value: "ENDSWITH"
                }
            ]
        };
    },
    computed: {
        /** @returns {[]} */
        gridHeaders() {
            if (!this.view) return [];

            let headers = this.viewDefinition.fields.map(item => {
                let filter = null;
                if (this.view.actions && this.view.actions.filter && this.view.actions.filter.enableColumns == true) {
                    filter = this.view.actions.filter.fields.find((f) => f.field == item.name);
                }

                return {
                    text: this.$options.filters.translate(item.labelKey),
                    value: item.name,
                    type: item.type || 'string',
                    align: (() => {
                        switch (item.type) {
                            case "boolean":
                                return 'center';
                            case "number":
                                return 'end';
                            default:
                                return 'start';
                        }
                    })(),
                    columnFilter: filter
                };
            });

            let actionButtonsCount = 0;
            for (const action in this.view.actions) {
                if (this.view.actions[action].enableRowButton) {
                    actionButtonsCount++;
                }
            }

            if (actionButtonsCount > 0)
                headers.push({
                    text: '',
                    value: 'actions',
                    sortable: false,
                    groupable: false,
                    align: 'end',
                    width: `${33 + (24 * actionButtonsCount)}px`,
                    class: "pa-0"
                });

            return headers;
        },
        /**
         * @returns {String[]}
         */
        getBooleanColumns() {
            if (!this.view) return [];
            return this.viewDefinition.fields.filter((f) => f.type == 'boolean').map((f) => f.name);
        },
        /** @returns {Number} */
        gridTotal() {
            if (!this.viewData || !this.viewData.data || this.viewData.data.length <= 0) return 0;
            return this.viewData.count;
        },
        /** @returns {[]} */
        gridRecords() {
            if (!this.viewData || !this.viewData.data || this.viewData.data.length <= 0) return [];

            let expressionEvaluators = [];
            for (let highlight of this.view.highlighters) {
                let evaluator = {
                    eval: LowLevelUtils.makeExpessionEvaluator(this.viewData.data[0], highlight.expression),
                    cssClasses: []
                };

                if (highlight.backgroundColor) evaluator.cssClasses.push(...highlight.backgroundColor.split(" "));
                if (highlight.fontColor) evaluator.cssClasses.push(`${highlight.fontColor}--text`);
                if (highlight.fontWeight) evaluator.cssClasses.push(`font-weight-${highlight.fontWeight}`);
                if (highlight.fontStyle) evaluator.cssClasses.push(`text-decoration-${highlight.fontStyle}`);
                if (highlight.fontItalic) evaluator.cssClasses.push("font-italic");

                expressionEvaluators.push(evaluator);
            }

            let records = [];
            for (let item of this.viewData.data) {
                let record = {
                    id: item.id
                };

                for (let field of this.viewDefinition.fields) {
                    if (!Object.prototype.hasOwnProperty.call(item, field.name))
                        record[field.name] = null;
                    // else if (field.targetName) {
                    //     record[`__${field.name}`] = item[field.name];
                    //     record[field.name] = item[field.name] != null ? item[field.name][field.targetName] : null;
                    // } else if (field.selectionList && field.selectionList.length > 0) {
                    //     record[`__${field.name}`] = item[field.name];
                    //     let label = field.selectionList.find(l => l.value == item[field.name]).title;
                    //     record[field.name] = item[field.name] != null ? label : null;
                    // }
                    else
                        record[field.name] = item[field.name];
                }

                for (let evaluator of expressionEvaluators) {
                    if (evaluator.eval(item))
                        record.__cssClasses = evaluator.cssClasses;
                }

                records.push(record);
            }

            return records;
            // return this.viewData.data;
        },
    },
    methods: {
        onPageChange(/** @type {Number} */ pageNumber) {
            this.viewDataPageNumber = pageNumber;
            this.loadData();
        },
        onRefresh() {
            this.viewDataPageNumber = 1;
            this.viewDataSortFields = [];
            this.viewDataSortDirections = [];
            this.viewSelectedRows = [];
            this.loadData();
        },
        onSortField(/** @type {String[] } */ sortFields) {
            this.viewDataSortFields.splice(0);
            this.viewDataSortFields.push(...sortFields);
            this.loadData();
        },
        onSortDescendant(/** @type {Boolean[] } */ sortDirections) {
            this.viewDataSortDirections.splice(0);
            this.viewDataSortDirections.push(...sortDirections);
            this.loadData();
        },
        onOpenItem(item) {
            const context = item || this.viewSelectedRows[0];
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.actions.open.view, context.id, true));
        },
        onEditItem(item) {
            const context = item || this.viewSelectedRows[0];
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.actions.edit.view, context.id));

        },
        onAddItem() {
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.actions.add.view, null));
        },
        onDeleteItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("delete-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("delete-entity-dialog-message", { entityName });
            dialog.iconColor = "error";
            dialog.icon = 'mdi-delete-alert';
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        onDeleteItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = 'mdi-exclamation-thick';
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
            else if (this.viewSelectedRows.length == 1) {
                this.onDeleteItem(this.viewSelectedRows[0]);
            }
            else {
                const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("delete-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("delete-entity-dialog-message", { entityName });
                dialog.iconColor = "error";
                dialog.icon = 'mdi-delete-alert';
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        onArchiveItems() {
            alert(this.viewSelectedRows.join(","));
        },
        onArchiveItem(item) {
            alert(item.id);
        },
        onDoubleClickRow(/** @type {Event}*/event, row) {
            event.stopPropagation();

            if (this.view.actions && this.view.actions.open && this.view.actions.open.enableDoubleClick)
                this.onOpenItem(row.item);
            else if (this.view.actions && this.view.actions.edit && this.view.actions.edit.enableDoubleClick)
                this.onEditItem(row.item);
        },
        onClickRow(rowData, row) {
            row.select(!row.isSelected);
        },
        onClickToolbarButton(/** @type {string} */actionName) {
            if (this.view.actions && this.view.actions[actionName] && this.view.actions[actionName].view)
                alert(this.view.actions[actionName].view);
        },
        onSearch(/** @type {String} */ searchTerm) {
            this.viewDataPageNumber = 1;
            this.viewSelectedRows = [];
            this.viewSearchTerm = searchTerm;
            this.loadData();
        },
        onFilterField(header) {
            this.viewDataPageNumber = 1;
            this.viewSelectedRows = [];

            let filterFieldValue = null;
            let filterFieldOperator = null;

            if (header.columnFilter.type == "string") {
                filterFieldValue = this.$refs[`filter-input-${header.value}`][0].internalValue;
                filterFieldOperator = this.$refs[`filter-operator-${header.value}`][0].internalValue;
            } else if (header.columnFilter.type == "list" || header.columnFilter.type == "search") {
                filterFieldValue = this.$refs[`filter-input-${header.value}`][0].internalValue;
                filterFieldOperator = "EQUALS";
            }

            let filterFieldIndex = this.viewColumnFilters.findIndex((f) => f.field == header.columnFilter.field);
            if (filterFieldIndex < 0) {
                const filterField = new ViewFilterField();
                filterField.field = header.columnFilter.field;
                filterField.type = header.columnFilter.type;
                filterFieldIndex = this.viewColumnFilters.push(filterField) - 1;
            }

            if (filterFieldValue)
                switch (filterFieldOperator) {
                    case "CONTAINS":
                        this.viewColumnFilters[filterFieldIndex].value = `%${filterFieldValue}%`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'like';
                        break;
                    case "STARTSWITH":
                        this.viewColumnFilters[filterFieldIndex].value = `${filterFieldValue}%`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'like';
                        break;
                    case "ENDSWITH":
                        this.viewColumnFilters[filterFieldIndex].value = `%${filterFieldValue}`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'like';
                        break;
                    case "EQUALS":
                        this.viewColumnFilters[filterFieldIndex].value = `${filterFieldValue}`;
                        this.viewColumnFilters[filterFieldIndex].operator = '=';
                        break;
                }
            else
                this.viewColumnFilters.splice(filterFieldIndex);


            this.loadData();
        },
        /** @returns {Boolean} */
        checkRowButtonVisibility(/** @type {string} */ actionName) {
            return this.view.actions && this.view.actions[actionName] && this.view.actions[actionName].enableRowButton == true;
        },
        checkColumnFiltersVisibility() {
            return this.view.actions && this.view.actions.filter && this.view.actions.filter.enableColumns == true;
        },
        checkFilterFieldVisibility(header, type) {
            return !['data-table-select', 'actions'].includes(header.value) && header.columnFilter && header.columnFilter.type == type;
        },
        checkFabButtonVisibility() {
            if (this.view.actions && this.view.actions.add && this.view.actions.add.enableFloatingButton == true)
                return true;
            else false;
        },
        /** @returns {Boolean} */
        getGridOption(/** @type {string} */ optionName) {
            if (this.view.options) {
                if (this.view.options[optionName] == true) return true;
                else return false;
            }
            else return false;
        },

        rowStyle(item) {
            let cssClasses = ["bordered-cell", "alternate-row"];
            if (item.__cssClasses)
                cssClasses.push(...item.__cssClasses);

            return cssClasses;
        },
        async loadData() {
            this.viewDataLoading = true;

            const query = new Query();
            query.brick = this.viewDefinition.brick;
            query.entity = this.viewDefinition.entity;
            query.fields = this.viewDefinition.fields.map(item => { return item.name; });
            query.filters = Array.from(this.viewDefinition.filters);
            query.take = 50;
            query.skip = (this.viewDataPageNumber - 1) * 50;

            if (this.viewDataSortFields.length > 0) {
                for (let idx = 0; idx < this.viewDataSortFields.length; idx++) {
                    const sort = new ViewSort();
                    sort.field = this.viewDataSortFields[idx];
                    sort.direction = this.viewDataSortDirections[idx] ? 'DESC' : 'ASC';
                    query.sorts.push(sort);
                }
            }
            else if (this.viewDefinition.sorts) {
                query.sorts = this.viewDefinition.sorts;
            }

            if (this.viewSearchTerm) {
                const searchFilter = new ViewFilter();
                searchFilter.leftOperator = "AND";
                searchFilter.expressionOperator = "OR";
                searchFilter.expressionValues = {};
                searchFilter.expressionValues["searchTerm"] = `%${this.viewSearchTerm}%`;

                for (const searchField of this.view.actions.search.fields) {
                    searchFilter.expressions.push(`$self.${searchField} like :searchTerm`);
                }

                query.filters.push(searchFilter);
            }

            if (this.viewColumnFilters && this.viewColumnFilters.length > 0) {
                const columnFilter = new ViewFilter();
                columnFilter.leftOperator = "AND";
                columnFilter.expressionOperator = "AND";
                columnFilter.expressionValues = {};

                for (const filterField of this.viewColumnFilters) {
                    columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} :${filterField.field}_field_filter`);
                    columnFilter.expressionValues[`${filterField.field}_field_filter`] = filterField.value;
                }
                console.log(query);
                if (columnFilter.expressions.length > 0)
                    query.filters.push(columnFilter);
            }

            this.viewData = await this.$store.getters[$.getters.APP_GET_RECORDS](query);
            this.viewDataLoading = false;
        },
    },
    mounted() {
        this.loadData().catch(ex => {
            console.error(ex);
            alert(ex.message);
        });
    }
}
</script>

<style>
.bordered-cell td {
    border-right: thin solid rgba(0, 0, 0, 0.12);
    /* border-bottom: none !important; */
}

.alternate-row:nth-child(even) {
    background: #f6f6f6;
}

.filter-input {
    border-radius: 0;
    border-right: thin solid rgba(0, 0, 0, 0.12);
}

/* .actionsCell {
    margin-left: -16px;
    margin-right: -12px;
} */
</style>
