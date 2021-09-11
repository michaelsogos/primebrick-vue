<template>
    <view-list-base
        :view="view"
        :viewSelectedRows="viewSelectedRows"
        @onDataLoaded="onDataLoaded"
        @onDataLoading="viewDataLoading = true"
        @onSelectAll="onSelectAll"
        @onReset="onReset"
    >
        <template v-slot:dataview="{ sortField, sortDescendant, changePage, pageNumber, enableMultiSelect, itemsPerPage }">
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
                :loading="viewDataLoading"
                :single-select="enableMultiSelect"
                v-model="viewSelectedRows"
                class="pa-4 d-flex grey lighten-4 flex-column data-iterator-fixed-footer"
                light
                :sort-desc.sync="viewSortingDesc"
            >
                <template v-slot:header="{ sort }">
                    <v-toolbar dense class="header" elevation="0" color="white">
                        <v-select
                            hide-details
                            solo
                            flat
                            class="filter-input"
                            dense
                            prepend-icon="mdi-sort-alphabetical-variant"
                            single-line
                            :label="$options.filters.translate('select-field')"
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
                            :label="$options.filters.translate('select-field')"
                            :menu-props="{ offsetY: true, rounded: '0' }"
                            v-model="viewSortingDesc"
                            color="tertiary"
                            :items="sortDirections"
                            style="max-width: 250px"
                            class="mr-1"
                        ></v-select>
                        <v-divider vertical></v-divider>
                        <v-spacer></v-spacer>

                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>

                        <v-btn icon>
                            <v-icon>mdi-heart</v-icon>
                        </v-btn>

                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:default="{ items, isExpanded, expand }">
                    <v-row class="flex-shrink-0">
                        <v-col v-for="item in items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                            <v-card>
                                <v-card-title class="tertiary--text">
                                    {{ getTitle(item) }}
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
                                <!-- <v-switch
                                    inset
                                    dense
                                    :input-value="isExpanded(item)"
                                    :label="isExpanded(item) ? 'Expanded' : 'Closed'"
                                    class="pl-4 mt-0"
                                    @change="(v) => expand(item, v)"
                                    v-if="getHasExpanded"
                                ></v-switch> -->

                                <v-btn text tile small @click.stop="expand(item, !isExpanded(item))" v-if="getHasExpanded">
                                    <v-icon small class="mx-1">{{ isExpanded(item) ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                                    {{ (isExpanded(item) ? "collapse" : "show-more") | translate }}
                                </v-btn>

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
            ]
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
        }
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
</style>