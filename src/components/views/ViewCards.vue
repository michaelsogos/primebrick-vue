<template>
    <view-list-base
        :view="view"
        :viewSelectedRows="viewSelectedRows"
        :viewFieldFilters="viewFieldFilters"
        @onDataLoaded="onDataLoaded"
        @onDataLoading="viewDataLoading = true"
        @onSelectAll="onSelectAll"
        @onReset="onReset"
    >
        <template
            v-slot:dataview="{
                sortField,
                sortDescendant,
                changePage,
                pageNumber,
                enableMultiSelect,
                itemsPerPage,
                filterFields,
                stringFieldOperators,
                loadFilterItems,
                doubleClickItem,
                clickItemFieldValue,
                showItemButton,
                editItem,
                openItem,
                deleteItem,
                archiveItem,
                restoreItem,
            }"
        >
            <v-data-iterator
                :items="getItems"
                item-key="id"
                :items-per-page="itemsPerPage"
                :single-expand="false"
                :page="pageNumber"
                :server-items-length="getItemsCount"
                :footer-props="{
                    showFirstLastPage: true,
                    itemsPerPageOptions: [itemsPerPage],
                }"
                @update:page="changePage"
                @update:sort-by="sortField"
                @update:sort-desc="sortDescendant"
                :single-select="enableMultiSelect"
                v-model="viewSelectedRows"
                class="pa-4 d-flex flex-column data-iterator-fixed-footer"
                light
                :sort-desc.sync="viewSortingDesc"
            >
                <template v-slot:header="{ sort }">
                    <v-toolbar dense class="header" elevation="0" color="white">
                        <v-progress-linear
                            :active="viewDataLoading"
                            :indeterminate="true"
                            absolute
                            bottom
                            height="2"
                            color="tertiary"
                        ></v-progress-linear>

                        <v-checkbox
                            :label="$options.filters.translate('select-all')"
                            hide-details
                            class="mr-4"
                            color="tertiary"
                            @change="onSelectAll"
                            :value="viewData && viewData.data.length == viewSelectedRows.length"
                        ></v-checkbox>

                        <v-divider
                            vertical
                            class="tertiary"
                            inset
                            v-if="getFilterHeaderEnabled && filterFields && filterFields.length > 0"
                        ></v-divider>

                        <v-select
                            hide-details
                            solo
                            flat
                            class="ml-2 filter-input"
                            dense
                            prepend-icon="mdi-sort-alphabetical-variant"
                            single-line
                            :label="$options.filters.translate('select-field-to-sort')"
                            color="tertiary"
                            :items="getSortFields()"
                            item-text="label"
                            :menu-props="{ offsetY: true, rounded: '0' }"
                            @change="(v) => sort(v)"
                            style="max-width: 250px"
                        ></v-select>

                        <v-select
                            hide-details
                            solo
                            flat
                            dense
                            single-line
                            :label="$options.filters.translate('direction')"
                            :menu-props="{ offsetY: true, rounded: '0' }"
                            v-model="viewSortingDesc"
                            color="tertiary"
                            :items="sortDirections"
                            style="max-width: 250px"
                            class="mr-2"
                        ></v-select>

                        <v-divider
                            vertical
                            class="tertiary"
                            inset
                            v-if="getFilterHeaderEnabled && filterFields && filterFields.length > 0"
                        ></v-divider>

                        <v-select
                            hide-details
                            solo
                            flat
                            dense
                            class="ml-2 filter-input"
                            prepend-icon="mdi-filter"
                            single-line
                            :label="$options.filters.translate('select-field-to-filter')"
                            color="tertiary"
                            :items="filterFields"
                            item-text="label"
                            :menu-props="{ offsetY: true, rounded: '0' }"
                            style="max-width: 250px"
                            return-object
                            v-model="viewSelectedFieldFilter"
                            v-if="getFilterHeaderEnabled && filterFields && filterFields.length > 0"
                        ></v-select>

                        <v-toolbar-items v-if="viewSelectedFieldFilter" style="height: auto !important">
                            <v-select
                                hide-details
                                solo
                                flat
                                dense
                                class="filter-input"
                                single-line
                                :label="$options.filters.translate('select-operator')"
                                color="tertiary"
                                :items="stringFieldOperators()"
                                :menu-props="{ offsetY: true, rounded: '0' }"
                                style="max-width: 250px"
                                v-model="viewSelectedFieldFilter.viewModel.selectedOperator"
                                v-if="viewSelectedFieldFilter.type == 'string'"
                                @change="onFilterField"
                            ></v-select>

                            <v-text-field
                                hide-details
                                solo
                                flat
                                dense
                                clearable
                                class="filter-input"
                                single-line
                                :label="$options.filters.translate('type-value')"
                                color="tertiary"
                                type="text"
                                style="max-width: 250px"
                                v-if="viewSelectedFieldFilter.type == 'string'"
                                v-model="viewSelectedFieldFilter.viewModel.selectedValue"
                                @change="onFilterField"
                            ></v-text-field>
                            <template v-if="viewSelectedFieldFilter.type == 'list'">
                                <v-autocomplete
                                    hide-details
                                    solo
                                    flat
                                    dense
                                    clearable
                                    deletable-chips
                                    single-line
                                    class="filter-input"
                                    :label="$options.filters.translate('select-value')"
                                    color="tertiary"
                                    :items="viewSelectedFieldFilter.listOptions.values"
                                    item-color="tertiary"
                                    :multiple="viewSelectedFieldFilter.listOptions.enableMultiSelection"
                                    :small-chips="viewSelectedFieldFilter.listOptions.enableMultiSelection"
                                    :menu-props="{ closeOnClick: true }"
                                    style="max-width: 250px"
                                    v-model="viewSelectedFieldFilter.viewModel.selectedValue"
                                    v-if="viewSelectedFieldFilter.listOptions.values"
                                    @blur="onFilterField"
                                ></v-autocomplete>
                                <v-autocomplete
                                    hide-details
                                    solo
                                    flat
                                    dense
                                    clearable
                                    deletable-chips
                                    single-line
                                    class="filter-input"
                                    :append-icon="viewSelectedFieldFilter.listOptions.query.error ? 'mdi-cancel' : '$dropdown'"
                                    :label="$options.filters.translate('select-value')"
                                    :color="viewSelectedFieldFilter.listOptions.query.error ? 'error' : 'tertiary'"
                                    :items="viewSelectedFieldFilter.listOptions.query.queryResultItems"
                                    item-color="tertiary"
                                    :loading="viewSelectedFieldFilter.listOptions.query.loading"
                                    @update:search-input="loadFilterItems($event, viewSelectedFieldFilter)"
                                    :multiple="viewSelectedFieldFilter.listOptions.enableMultiSelection"
                                    :small-chips="viewSelectedFieldFilter.listOptions.enableMultiSelection"
                                    :menu-props="{ closeOnClick: true }"
                                    v-model="viewSelectedFieldFilter.viewModel.selectedValue"
                                    v-if="viewSelectedFieldFilter.listOptions.query"
                                    @blur="onFilterField"
                                >
                                    <template v-slot:no-data>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title
                                                    :class="[viewSelectedFieldFilter.listOptions.query.error ? 'error--text' : 'tertiary--text']"
                                                >
                                                    {{
                                                        (viewSelectedFieldFilter.listOptions.query.error ? "query-error" : "no-data-message")
                                                            | translate
                                                    }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>

                                    <template v-slot:append-item>
                                        <div
                                            v-if="
                                                viewSelectedFieldFilter.listOptions.query.queryResultItems &&
                                                viewSelectedFieldFilter.listOptions.query.queryResultItems.length > 10
                                            "
                                            class="caption text-end px-4 tertiary--text"
                                        >
                                            {{
                                                "count-items-found" | translate({ count: viewSelectedFieldFilter.listOptions.query.queryResultCount })
                                            }}
                                        </div>
                                    </template>
                                </v-autocomplete>
                            </template>
                        </v-toolbar-items>

                        <v-divider
                            vertical
                            class="tertiary"
                            inset
                            v-if="getFilterHeaderEnabled && filterFields && filterFields.length > 0"
                        ></v-divider>
                        <v-spacer></v-spacer>

                        <v-btn icon>
                            <v-icon>mdi-heart</v-icon>
                        </v-btn>

                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>

                <template v-slot:default="{ items, isExpanded, expand, isSelected, select }">
                    <v-row class="flex-shrink-0">
                        <v-col v-for="item in items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                            <v-card>
                                <v-card-title class="tertiary--text align-start">
                                    <div
                                        class="col-12 d-flex flex-wrap pa-0"
                                        @click="select(item, !isSelected(item))"
                                        @dblclick="doubleClickItem($event, { item })"
                                    >
                                        <div class="col-6 pa-0">
                                            <span @click.stop="clickItemFieldValue($event, { item })">{{ getTitle(item) }}</span>
                                        </div>
                                        <div class="col-6 pa-0 d-flex flex-row-reverse">
                                            <v-checkbox
                                                hide-details
                                                class="ma-0 no-margin"
                                                :value="isSelected(item)"
                                                @change="(v) => select(item, v)"
                                                on-icon="mdi-checkbox-marked-circle-outline"
                                                off-icon="mdi-checkbox-blank-circle-outline"
                                                color="tertiary"
                                            ></v-checkbox>
                                            <div v-if="isSelected(item)" class="corner-triangle-top-right"></div>
                                        </div>
                                    </div>
                                </v-card-title>
                                <v-card-subtitle>
                                    {{ getSubtitle(item) }}
                                </v-card-subtitle>
                                <v-card-text>
                                    <template v-for="(line, index) in getLines">
                                        <v-row :key="index" no-gutters>
                                            <v-col
                                                v-for="(filler, index) in getFillers(item, line)"
                                                :key="index"
                                                :cols="filler.columnSize"
                                                :class="[`text-${filler.align}`]"
                                                :align-self="filler.isChip ? 'center' : 'start'"
                                                :offset="filler.columnOffset"
                                            >
                                                <v-chip v-if="filler.isChip" label color="tertiary" dark small>
                                                    {{ filler.value }}
                                                </v-chip>
                                                <template v-else>
                                                    <span v-if="!filler.hideLabel" class="caption tertiary--text">
                                                        {{ filler.label }}
                                                    </span>
                                                    <br />
                                                    <v-simple-checkbox
                                                        v-if="filler.isCheckBox"
                                                        :value="filler.value == 'true'"
                                                        disabled
                                                        class="no-margin"
                                                    ></v-simple-checkbox>
                                                    <span v-else :class="['body-2', 'primary--text', filler.isBold ? 'font-weight-bold' : '']">
                                                        {{ filler.value }}
                                                    </span>
                                                </template>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-card-text>
                                <v-card-actions class="">
                                    <v-btn text tile small @click.stop="expand(item, !isExpanded(item))" v-if="getHasExpanded">
                                        <v-icon small class="mx-1">{{ isExpanded(item) ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                                        {{ (isExpanded(item) ? "collapse" : "show-more") | translate }}
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-icon
                                        v-if="showItemButton(ViewAction.OPEN, item)"
                                        dense
                                        color="primary"
                                        class="mr-2"
                                        @click.stop="openItem(item)"
                                    >
                                        mdi-eye
                                    </v-icon>
                                    <v-icon
                                        v-if="showItemButton(ViewAction.EDIT, item)"
                                        dense
                                        color="primary"
                                        class="mr-2"
                                        @click.stop="editItem(item)"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                    <v-icon
                                        v-if="showItemButton(ViewAction.DELETE, item)"
                                        dense
                                        class="mr-2"
                                        color="error"
                                        @click.stop="deleteItem(item)"
                                    >
                                        mdi-delete-alert
                                    </v-icon>
                                    <v-icon
                                        v-if="showItemButton(ViewAction.ARCHIVE, item)"
                                        dense
                                        class="mr-2"
                                        color="error"
                                        @click.stop="archiveItem(item)"
                                    >
                                        mdi-trash-can
                                    </v-icon>
                                    <v-icon
                                        v-if="showItemButton(ViewAction.RESTORE, item)"
                                        dense
                                        class="mr-2"
                                        color="primary"
                                        @click.stop="restoreItem(item)"
                                    >
                                        mdi-restore
                                    </v-icon>
                                </v-card-actions>

                                <v-divider></v-divider>
                                <v-card-text v-if="isExpanded(item)">
                                    <template v-for="(line, index) in getLines">
                                        <v-row :key="index" no-gutters>
                                            <v-col
                                                v-for="(filler, index) in getFillers(item, line, true)"
                                                :key="index"
                                                :cols="filler.columnSize"
                                                :class="[`text-${filler.align}`]"
                                                :align-self="filler.isChip ? 'center' : 'start'"
                                                :offset="filler.columnOffset"
                                            >
                                                <v-chip v-if="filler.isChip" label color="tertiary" dark small>
                                                    {{ filler.value }}
                                                </v-chip>
                                                <template v-else>
                                                    <span v-if="!filler.hideLabel" class="caption tertiary--text">
                                                        {{ filler.label }}
                                                    </span>
                                                    <br />
                                                    <v-simple-checkbox
                                                        v-if="filler.isCheckBox"
                                                        :value="filler.value == 'true'"
                                                        disabled
                                                        class="no-margin"
                                                    ></v-simple-checkbox>
                                                    <span v-else :class="['body-2', 'primary--text', filler.isBold ? 'font-weight-bold' : '']">
                                                        {{ filler.value }}
                                                    </span>
                                                </template>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
            </v-data-iterator>
        </template>
    </view-list-base>
</template>

<script>
import { UnknownEntity } from '../../models/UnknownEntity';
import { View, ViewCardFieldFiller } from "../../models/View";
import ViewListBase from "../abstracts/ViewListBase.vue";
import { LowLevelUtils } from "../../common/LowLevelUtils";
import { StringUtils } from '../../common/StringUtils';
import { ViewAction } from '../../enums/ViewAction';

export default {
    name: "view-cards",
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
            /** @type {import("../../models/UnknownEntity").UnknownEntity[]} */
            viewSelectedRows: [],
            viewDataLoading: false,
            /** @type {{eval: Function, cssClasses: String[]}[]} */
            highlightEvaluators: [],
            /** @type {Boolean} */
            viewSortingDesc: false,
            sortDirections: [
                {
                    text: "Ascending",
                    value: [false]
                },
                {
                    text: "Descending",
                    value: [true]
                }
            ],
            /** @type {import("../../models/View").ViewFieldFilter} */
            viewSelectedFieldFilter: null,
            /** @type {import("../../models/View").ViewFieldFilter[]} */
            viewFieldFilters: [],
            ViewAction
        };
    },
    computed: {
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
        /** @returns {Number} */
        getItemsCount() {
            if (!this.viewData?.data || this.viewData.data.length <= 0) return 0;
            return this.viewData.count;
        },
        /** @returns {Number[]} */
        getLines() {
            const fieldsWithLayout = this.view.definition.fields.filter((/** @type {import("../../models/View").ViewCardField} */ f) => f.layout && !f.layout.isTitle && !f.layout.isSubTitle);
            const lines = [];
            for (const field of fieldsWithLayout) {
                if (!lines.includes(field.layout.line))
                    lines.push(field.layout.line);
            }

            return lines.sort((a, b) => a - b);
        },
        /** @returns {Boolean} */
        getHasExpanded() {
            return this.view.definition.fields.some((/** @type {import("../../models/View").ViewCardField} */ f) => (f.layout?.isDetail || false));
        },
        /** @returns {Boolean} */
        getFilterHeaderEnabled() {
            return this.view.definition?.actions?.filter?.enableHeader;
        }
    },
    methods: {
        /**
         * @param {import("../../models/QueryResult").QueryResult} queryResult
         */
        onDataLoaded(queryResult) {
            this.viewData = queryResult;
            this.buildHighlightEvaluators();
            this.viewDataLoading = false;
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
        },
        onSelectAll() {
            if (this.viewSelectedRows.length != this.viewData.data.length)
                this.viewSelectedRows.splice(0, this.viewSelectedRows.length, ...this.viewData.data);
            else
                this.viewSelectedRows.splice(0);
        },
        onReset() {
            this.viewSelectedRows.splice(0);
        },
        /** 
      * @param {import("../../models/UnknownEntity").UnknownEntity} item
      * @returns {String} 
      * */
        getTitle(item) {
            if (this.view.definition?.options?.enableRecordNameAsTitle)
                return StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);

            const titleField = this.view.definition?.fields?.find((/** @type {import("../../models/View").ViewCardField} */ f) => f.layout?.isTitle == true);
            if (titleField) return `${item[titleField.name]}`;
            else return "{NO_TITLE_DEFINED}";
        },
        /** 
         * @param {import("../../models/UnknownEntity").UnknownEntity} item
         * @returns {String} 
         * */
        getSubtitle(item) {
            if (this.view.definition?.options?.enableRecordNameAsSubTitle)
                return StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);

            const subTitleField = this.view.definition?.fields?.find((/** @type {import("../../models/View").ViewCardField} */ f) => f.layout?.isSubTitle == true);
            if (subTitleField) return `${item[subTitleField.name]}`;
            else return "";

        },
        /**
        * @param {import("../../models/UnknownEntity").UnknownEntity} item
        * @param {Number} line
        * @param {Boolean} isDetail
        * @returns {ViewCardFieldFiller[]}
        */
        getFillers(item, line, isDetail = false) {
            const fields = this.view.definition.fields.filter((/** @type {import("../../models/View").ViewCardField} */ f) => f.layout && !f.layout.isTitle && !f.layout.isSubTitle && f.layout.line == line && (f.layout.isDetail || false) == isDetail);
            return fields.map((f) => {
                const isLeft = f.layout.filling.includes("left");
                const isMiddle = f.layout.filling.includes("middle");
                const isRight = f.layout.filling.includes("right");

                const checkFieldHasPosition = function (/** @type {("left" | "middle" | "right")} */ position) {
                    return fields.some((f) => f.layout.filling.includes(position));
                };

                let columnSize = 4;
                let columnOffset = 0;
                if (isLeft && isMiddle && isRight) columnSize = 12;
                else if (isLeft && isMiddle && !isRight) columnSize = 6;
                else if (!isLeft && isMiddle) {
                    if (isRight) columnSize = 6;
                    if (!checkFieldHasPosition('left')) columnOffset = 4;
                }
                else if (!isLeft && !isMiddle && isRight && !checkFieldHasPosition('middle'))
                    if (!checkFieldHasPosition('left'))
                        columnOffset = 6;
                    else
                        columnOffset = 4;

                const filler = new ViewCardFieldFiller();
                filler.position = (isLeft && 1) | (isMiddle && 2) | (isRight && 4);
                filler.value = `${item[f.name]}` || "-";
                filler.label = `${this.$options.filters.translate(f.labelKey)}`;
                filler.columnSize = columnSize;
                filler.columnOffset = columnOffset;
                filler.align = f.layout.align || "left";
                filler.isChip = f.layout.isChip || false;
                filler.hideLabel = f.layout.hideLabel || false;
                filler.isBold = f.layout.isBold || false;
                filler.isCheckBox = f.type == "boolean";

                return filler;
            }).sort(f => f.position);
        },
        getSortFields() {
            const fields = [];
            for (const /** @type {import("../../models/View").ViewColumnField} */ item of this.view.definition.fields) {
                if (item.hideColumn || item.disableSort) continue;

                fields.push({
                    label: this.$options.filters.translate(item.labelKey),
                    value: item.name
                });
            }

            return fields;
        },
        onFilterField() {
            this.viewSelectedRows.splice(0);

            const selectedValue = this.viewSelectedFieldFilter?.viewModel?.selectedValue;

            if (selectedValue) {
                if (this.viewSelectedFieldFilter.type == "list") {
                    if (Array.isArray(selectedValue)) {
                        this.viewSelectedFieldFilter.viewModel.selectedOperator = "IN";
                    }
                    else {
                        this.viewSelectedFieldFilter.viewModel.selectedOperator = "EQUALS";
                    }
                }

                switch (this.viewSelectedFieldFilter.viewModel.selectedOperator) {
                    case "CONTAINS":
                        this.viewSelectedFieldFilter.value = `%${selectedValue}%`;
                        this.viewSelectedFieldFilter.operator = 'LIKE';
                        break;
                    case "STARTSWITH":
                        this.viewSelectedFieldFilter.value = `${selectedValue}%`;
                        this.viewSelectedFieldFilter.operator = 'LIKE';
                        break;
                    case "ENDSWITH":
                        this.viewSelectedFieldFilter.value = `%${selectedValue}`;
                        this.viewSelectedFieldFilter.operator = 'LIKE';
                        break;
                    case "EQUALS":
                        this.viewSelectedFieldFilter.value = `${selectedValue}`;
                        this.viewSelectedFieldFilter.operator = '=';
                        break;
                    case "IN":
                        this.viewSelectedFieldFilter.value = selectedValue;
                        this.viewSelectedFieldFilter.operator = 'IN';
                        break;
                }

                this.viewFieldFilters.splice(0, this.viewFieldFilters.length, this.viewSelectedFieldFilter);
            }
            else
                this.viewFieldFilters.splice(0);
        },
    }
}
</script>
<style >
.no-margin .v-input--selection-controls__input {
    margin: 0px;
}

.data-iterator-fixed-footer.v-data-iterator > .header {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.data-iterator-fixed-footer.v-data-iterator > .row {
    overflow: scroll-y;
    padding: 48px 0px 36px 0px;
}

.data-iterator-fixed-footer.v-data-iterator > .v-data-footer {
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
}

.theme--light .v-data-iterator .v-data-footer {
    border-top: thin solid rgba(0, 0, 0, 0.12);
}

.corner-triangle-top-right {
    width: 0;
    height: 0;
    border-top: 15px solid var(--v-tertiary-base);
    border-left: 15px solid transparent;
    border-right: 15px solid var(--v-tertiary-base);
    border-bottom: 15px solid transparent;
    position: absolute;
    top: 0;
    right: 0;
}
</style>