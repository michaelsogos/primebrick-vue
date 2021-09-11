<template>
    <view-list-base
        :view="view"
        :viewFieldFilters="viewFieldFilters"
        :viewSelectedRows="viewSelectedRows"
        @onDataLoaded="onDataLoaded"
        @onDataLoading="viewDataLoading = true"
        @onSelectAll="onSelectAll"
        @onReset="onReset"
    >
        <template
            v-slot:dataview="{
                deleteItem,
                archiveItem,
                restoreItem,
                changePage,
                sortField,
                sortDescendant,
                doubleClickRow,
                openItem,
                editItem,
                clickRow,
                showRowButton,
                pageNumber,
                loadFilterItems,
                enableMultiSelect,
                itemsPerPage,
            }"
        >
            <v-data-table
                :headers="viewGridColumns"
                :items="getItems"
                :items-per-page="itemsPerPage"
                item-key="id"
                :item-class="rowStyle"
                fixed-header
                dense
                height="100%"
                class="d-flex flex-column fill-height"
                :page="pageNumber"
                :server-items-length="getItemsCount"
                :footer-props="{
                    showFirstLastPage: true,
                    itemsPerPageOptions: [itemsPerPage],
                }"
                @update:page="changePage"
                @update:sort-by="sortField"
                @update:sort-desc="sortDescendant"
                @dblclick:row="doubleClickRow"
                @click:row="clickRow"
                :loading="viewDataLoading"
                show-group-by
                show-select
                :single-select="enableMultiSelect"
                v-model="viewSelectedRows"
            >
                <template v-slot:[`body.prepend`]>
                    <tr v-if="checkColumnFiltersVisibility()" class="bordered-cell">
                        <template v-for="(item, idx) in gridFilterHeaders">
                            <td v-if="item != null" :key="idx" class="pa-0 ma-0" role="columnheader" scope="col">
                                <template v-if="item.type == 'string'">
                                    <v-row no-gutters>
                                        <v-col cols="4">
                                            <v-select
                                                hide-details
                                                solo
                                                flat
                                                dense
                                                :ref="`filter-operator-${item.field}`"
                                                :items="getStringFieldOperator()"
                                                value="CONTAINS"
                                                class="filter-input"
                                                color="tertiary"
                                                @change="onFilterField(item)"
                                                :menu-props="{ offsetY: true, rounded: '0' }"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                hide-details
                                                solo
                                                flat
                                                dense
                                                clearable
                                                type="text"
                                                :ref="`filter-input-${item.field}`"
                                                @change="onFilterField(item)"
                                                color="tertiary"
                                                :label="item.label"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon small>mdi-filter</v-icon>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </template>
                                <template v-if="item.type == 'list'">
                                    <v-row no-gutters>
                                        <v-col>
                                            <v-autocomplete
                                                hide-details
                                                solo
                                                flat
                                                dense
                                                :ref="`filter-input-${item.field}`"
                                                :items="item.listOptions.values"
                                                :label="item.label"
                                                @blur="onFilterField(item)"
                                                clearable
                                                :multiple="item.listOptions.enableMultiSelection"
                                                deletable-chips
                                                :small-chips="item.listOptions.enableMultiSelection"
                                                v-if="item.listOptions.values"
                                                item-color="tertiary"
                                                color="tertiary"
                                                :menu-props="{ closeOnClick: true }"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon small>mdi-filter</v-icon>
                                                </template>
                                            </v-autocomplete>
                                            <v-autocomplete
                                                hide-details
                                                solo
                                                flat
                                                dense
                                                :ref="`filter-input-${item.field}`"
                                                :items="item.listOptions.query.queryResultItems"
                                                :label="item.label"
                                                :loading="item.listOptions.query.loading"
                                                @update:search-input="loadFilterItems($event, item)"
                                                @blur="onFilterField(item)"
                                                clearable
                                                :multiple="item.listOptions.enableMultiSelection"
                                                deletable-chips
                                                :small-chips="item.listOptions.enableMultiSelection"
                                                v-if="item.listOptions.query"
                                                item-color="tertiary"
                                                :color="item.listOptions.query.error ? 'error' : 'tertiary'"
                                                :append-icon="item.listOptions.query.error ? 'mdi-cancel' : '$dropdown'"
                                                :menu-props="{ closeOnClick: true }"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon small>mdi-filter</v-icon>
                                                </template>

                                                <template v-slot:no-data>
                                                    <v-list-item>
                                                        <v-list-item-content>
                                                            <v-list-item-title
                                                                :class="[item.listOptions.query.error ? 'error--text' : 'tertiary--text']"
                                                            >
                                                                {{ (item.listOptions.query.error ? "query-error" : "no-data-message") | translate }}
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </template>

                                                <template v-slot:append-item>
                                                    <div
                                                        v-if="item.listOptions.query.queryResultItems.length > 10"
                                                        class="caption text-end px-4 tertiary--text"
                                                    >
                                                        {{ "count-items-found" | translate({ count: item.listOptions.query.queryResultCount }) }}
                                                    </div>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                    </v-row>
                                </template>
                            </td>
                            <td v-else :key="idx" class="pa-0 ma-0" role="columnheader" scope="col"></td>
                        </template>
                    </tr>
                </template>

                <template v-for="boolColumn in getBooleanColumns" v-slot:[`item.${boolColumn}`]="{ item }">
                    <v-simple-checkbox v-model="item[boolColumn]" disabled :key="boolColumn"></v-simple-checkbox>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="actionsCell">
                        <v-icon
                            v-if="showRowButton(ViewAction.OPEN, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            color="primary"
                            class="mr-2"
                            @click.stop="openItem(item)"
                        >
                            mdi-eye
                        </v-icon>
                        <v-icon
                            v-if="showRowButton(ViewAction.EDIT, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            color="primary"
                            class="mr-2"
                            @click.stop="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            v-if="showRowButton(ViewAction.DELETE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="error"
                            @click.stop="deleteItem(item)"
                        >
                            mdi-delete-alert
                        </v-icon>
                        <v-icon
                            v-if="showRowButton(ViewAction.ARCHIVE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="error"
                            @click.stop="archiveItem(item)"
                        >
                            mdi-trash-can
                        </v-icon>
                        <v-icon
                            v-if="showRowButton(ViewAction.RESTORE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="primary"
                            @click.stop="restoreItem(item)"
                        >
                            mdi-restore
                        </v-icon>
                    </div>
                </template>
            </v-data-table>
        </template>
    </view-list-base>
</template>

<script>
import { View, ViewFieldFilter, ViewFieldFilterListQuery } from 'src/models/View';
import { ViewAction } from "../../enums/ViewAction";
import { ViewGridHeader } from '../../models/ViewGridHeader';
import { LowLevelUtils } from "../../common/LowLevelUtils";
import ViewListBase from "../abstracts/ViewListBase.vue";
import { StringFilterOperator } from "../../enums/StringFilterOperator";
import { UnknownEntity } from '../../models/UnknownEntity';

export default {
    name: "view-grid",
    components: {
        ViewListBase
    },
    props: {
        view: View,
    },
    data: function () {
        return {
            /** @type {import("../../models/QueryResult").QueryResult} */
            viewData: null,
            viewDataLoading: false,
            /** @type {ViewFieldFilter[]} */
            viewFieldFilters: [],
            /** @type {import("../../models/UnknownEntity").UnknownEntity[]} */
            viewSelectedRows: [],
            /** @type  {import("../../models/ViewGridHeader").ViewGridHeader[]} */
            viewGridColumns: [],
            ViewAction,
            /** @type {{eval: Function, cssClasses: String[]}[]} */
            highlightEvaluators: []
        };
    },
    computed: {
        /**
         * @returns {String[]}
         */
        getBooleanColumns() {
            if (!this.view) return [];
            return this.view.definition.fields.filter((f) => f.type == 'boolean').map((f) => f.name);
        },
        /** @returns {Number} */
        getItemsCount() {
            if (!this.viewData?.data || this.viewData.data.length <= 0) return 0;
            return this.viewData.count;
        },
        /** @returns {UnknownEntity[]} */
        getItems() {
            if (!this.viewData?.data || this.viewData.data.length <= 0) return [];

            let records = [];
            for (let item of this.viewData.data) {
                let record = new UnknownEntity();
                record.id = item.id;

                for (let field of this.view.definition.fields) {
                    if (!Object.prototype.hasOwnProperty.call(item, field.name))
                        record[field.name] = null;
                    else
                        record[field.name] = item[field.name];
                }

                records.push(record);
            }

            return records;
        },
        /** @return {ViewFieldFilter[]} */
        gridFilterHeaders() {
            const filterHeaders = this.viewGridColumns.map((c) => c.columnFilter || null);
            if (this.view.definition.options.enableMultiSelect) filterHeaders.unshift(null);

            for (const filter of filterHeaders) {
                if (filter && filter.type == 'list' && Array.isArray(filter.listOptions.values)) {
                    for (const value of filter.listOptions.values)
                        value.text = this.$options.filters.translate(value.labelKey);
                }
                if (filter && filter.type == 'list' && filter.listOptions.query) {
                    filter.listOptions.query = Object.assign(new ViewFieldFilterListQuery, filter.listOptions.query);
                }
            }

            return filterHeaders;
        },
    },
    methods: {
        getStringFieldOperator() {
            const result = StringFilterOperator.map((o) => {
                return {
                    text: this.$options.filters.translate(o.labelKey),
                    value: o.value
                };
            });

            return result;
        },
        /**
         * @param {import("../../models/QueryResult").QueryResult} queryResult
         */
        onDataLoaded(queryResult) {
            this.viewData = queryResult;
            this.buildHighlightEvaluators();
            this.viewDataLoading = false;
        },
        onReset() {
            this.viewSelectedRows.splice(0);
        },
        /**
         * @param {ViewFieldFilter} filter
         */
        onFilterField(filter) {
            this.viewSelectedRows.splice(0);

            let filterFieldValue = null;
            let filterFieldOperator = null;

            if (filter.type == "string") {
                filterFieldValue = this.$refs[`filter-input-${filter.field}`][0].internalValue;
                filterFieldOperator = this.$refs[`filter-operator-${filter.field}`][0].internalValue;
            } else if (filter.type == "list") {
                const selectedValues = this.$refs[`filter-input-${filter.field}`][0].internalValue;
                if (selectedValues && selectedValues.length > 0) {
                    filterFieldValue = selectedValues;
                    if (Array.isArray(selectedValues)) {
                        filterFieldOperator = "IN";
                    }
                    else {
                        filterFieldOperator = "EQUALS";
                    }
                }
            }

            let filterFieldIndex = this.viewFieldFilters.findIndex((f) => f.field == filter.field);
            let filterField = null;

            if (filterFieldIndex < 0) {
                filterField = new ViewFieldFilter();
                filterField.field = filter.field;
                filterField.type = filter.type;
            } else {
                filterField = this.viewFieldFilters[filterFieldIndex];
            }

            if (filterFieldValue) {
                switch (filterFieldOperator) {
                    case "CONTAINS":
                        filterField.value = `%${filterFieldValue}%`;
                        filterField.operator = 'LIKE';
                        break;
                    case "STARTSWITH":
                        filterField.value = `${filterFieldValue}%`;
                        filterField.operator = 'LIKE';
                        break;
                    case "ENDSWITH":
                        filterField.value = `%${filterFieldValue}`;
                        filterField.operator = 'LIKE';
                        break;
                    case "EQUALS":
                        filterField.value = `${filterFieldValue}`;
                        filterField.operator = '=';
                        break;
                    case "IN":
                        filterField.value = filterFieldValue;
                        filterField.operator = 'IN';
                        break;
                }

                if (filterFieldIndex < 0)
                    this.viewFieldFilters.splice(filterFieldIndex, 1, filterField);
                else
                    this.viewFieldFilters.push(filterField);
            }
            else
                this.viewFieldFilters.splice(filterFieldIndex);

        },
        getRowButtonDenseSize() {
            let count = 0;
            for (const action in this.view.definition.actions) {
                if (action == ViewAction.RESTORE && this.view.definition.actions.archivedFilter) continue;
                if (this.view.definition.actions[action].enableItemButton == true)
                    count += 1;
            }

            return count > 3 ? false : true;
        },
        checkColumnFiltersVisibility() {
            return this.view.definition?.actions?.filter?.enableHeader || false;
        },
        /**
         * @param {import("../../models/UnknownEntity").UnknownEntity} item
         * @returns {String[]}
         */
        rowStyle(item) {
            let cssClasses = ["bordered-cell", "alternate-row"];

            for (let evaluator of this.highlightEvaluators) {
                if (evaluator.eval(item))
                    cssClasses.push(...evaluator.cssClasses);
            }

            return cssClasses;
        },
        buildGridColumns() {
            this.viewGridColumns.splice(0);

            if (!this.view) return;

            const headers = [];

            for (const /** @type {import("../../models/View").ViewColumnField} */ item of this.view.definition.fields) {
                if (item.hideColumn == true) continue;

                let filter = null;
                if (this.view.definition?.actions?.filter?.enableHeader) {
                    filter = this.view.definition.actions.filter.fields.find((f) => f.field == item.name);
                    if (filter) {
                        filter.label = this.$options.filters.translate(item.labelKey);
                    }
                }

                const viewGridHeader = new ViewGridHeader();
                viewGridHeader.text = this.$options.filters.translate(item.labelKey);
                viewGridHeader.value = item.name;
                viewGridHeader.sortable = (!item.disableSort) ? true : false;
                viewGridHeader.groupable = (!item.disableGroup) ? true : false;
                viewGridHeader.type = item.type || 'string';
                switch (item.type) {
                    case "boolean":
                        viewGridHeader.align = 'center';
                        break;
                    case "number":
                        viewGridHeader.align = 'end';
                        break;
                    default:
                        viewGridHeader.align = 'start';
                        break;
                }
                viewGridHeader.columnFilter = filter;

                headers.push(viewGridHeader);
            }

            let actionButtonsCount = 0;
            for (const action in this.view.definition.actions) {
                if (this.view.definition.actions[action].enableItemButton) {
                    actionButtonsCount++;
                }
            }

            if (actionButtonsCount > 0) {
                const viewGridHeader = new ViewGridHeader();
                viewGridHeader.text = '';
                viewGridHeader.value = 'actions';
                viewGridHeader.sortable = false;
                viewGridHeader.groupable = false;
                viewGridHeader.align = 'end';
                viewGridHeader.width = `${33 + ((this.getRowButtonDenseSize() ? 24 : 20) * actionButtonsCount)}px`;
                viewGridHeader.class = "pa-0";
                headers.push(viewGridHeader);
            }

            this.viewGridColumns.push(...headers);
        },
        onSelectAll() {
            if (this.viewSelectedRows.length != this.viewData.data.length)
                this.viewSelectedRows.splice(0, this.viewSelectedRows.length, ...this.viewData.data);
            else
                this.viewSelectedRows.splice(0);
        },
        buildHighlightEvaluators() {
            this.highlightEvaluators.splice(0);

            if (!this.view || !(this.viewData?.data) || this.viewData.data.length <= 0) return;

            for (let highlight of this.view.definition.highlighters) {
                let evaluator = {
                    eval: LowLevelUtils.makeExpessionEvaluator(this.viewData.data[0], highlight.expression),
                    cssClasses: []
                };

                if (highlight.backgroundColor) evaluator.cssClasses.push(...highlight.backgroundColor.split(" "));
                if (highlight.fontColor) evaluator.cssClasses.push(`${highlight.fontColor}--text`);
                if (highlight.fontWeight) evaluator.cssClasses.push(`font-weight-${highlight.fontWeight}`);
                if (highlight.fontStyle) evaluator.cssClasses.push(`text-decoration-${highlight.fontStyle}`);
                if (highlight.fontItalic) evaluator.cssClasses.push("font-italic");

                this.highlightEvaluators.push(evaluator);
            }
        }
    },
    mounted() {
        this.buildGridColumns();
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

.v-data-table--fixed-header > .v-data-table__wrapper > table > tbody > tr > td[role="columnheader"] {
    position: sticky;
    top: 32px;
    background: #fff;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: rgb(255, 255, 255);
    z-index: 1;
}

table > tbody > tr > td[role="columnheader"] .v-text-field.v-text-field--solo .v-input__control {
    min-height: 32px !important;
    padding: 0;
}

.v-list-item__mask {
    color: var(--v-tertiary-base) !important;
}
</style>
