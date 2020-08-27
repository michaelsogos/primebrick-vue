<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0">
        <h-panel>
            <template v-slot:header>
                <v-toolbar
                    dense
                    flat
                    tile
                    :color="`${computeColor(view.color)} lighten-5`"
                    height="36"
                    :style="`border-bottom: 2px solid ${computeCssColor(view.color)} !important`"
                >
                    <v-btn text tile class="caption primary--text">
                        <v-icon small left>mdi-plus</v-icon>add
                    </v-btn>
                    <v-btn text tile class="caption error--text">
                        <v-icon small left>mdi-trash-can</v-icon>delete
                    </v-btn>
                    <v-btn text tile class="caption primary--text" @click="onRefresh">
                        <v-icon small left>mdi-refresh</v-icon>aggiorna
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-if="view.alternativeViews.length > 0" :value="0" dark>
                        <v-btn
                            small
                            :color="computeColor(view.color)"
                            :title="view.definition.type"
                        >
                            <v-icon small>{{getViewIcon(view.definition.type)}}</v-icon>
                        </v-btn>
                        <template v-for="(item) in view.alternativeViews">
                            <v-btn
                                :key="item.type"
                                small
                                :color="computeColor(view.color)"
                                :title="item.type"
                            >
                                <v-icon small>{{getViewIcon(item.type)}}</v-icon>
                            </v-btn>
                        </template>
                    </v-btn-toggle>
                </v-toolbar>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
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
                                itemsPerPageOptions:[50]
                                }"
                @update:page="onPageChange"
                @update:sort-by="onSortField"
                @update:sort-desc="onSortDescendant"
                @dblclick:row="onDoubleClickRow"
                :loading="viewDataLoading"
                show-group-by
                show-select
            >
                <template v-slot:item.actions="{ item }" class="pa-0">
                    <div class="actionsCell">
                        <v-icon
                            v-if="view.actions.onEdit.enableRowButton"
                            small
                            class="mr-2"
                            @click="onEditItem(item)"
                        >mdi-pencil</v-icon>
                        <v-icon
                            v-if="view.actions.onDelete.enableRowButton"
                            small
                            class="mr-2"
                            @click="onEditItem(item)"
                        >mdi-delete-alert</v-icon>
                        <v-icon
                            v-if="view.actions.onArchive.enableRowButton"
                            small
                            class="mr-2"
                            @click="onEditItem(item)"
                        >mdi-trash-can</v-icon>
                    </div>
                </template>
            </v-data-table>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../../store/types";
// eslint-disable-next-line no-unused-vars
import { ViewGridDefinition } from "../../models/ViewGridDefinition";
// eslint-disable-next-line no-unused-vars
import { QueryResult } from "../../models/QueryResult";
// import { LowLevelUtils } from "../../common/LowLevelUtils";
// eslint-disable-next-line no-unused-vars
import { View, ViewNameType, ViewSort } from 'src/models/View';
import { Query } from 'src/models/Query';

export default {
    name: "view-grid",
    props: {
        view: Object,
    },
    data: function () {
        return {
            /** @type {QueryResult} */
            viewData: null,
            viewDataLoading: false,
            viewDataPageNumber: 1,
            viewDataSortFields: [],
            viewDataSortDirections: []
        };
    },
    computed: {
        /** @returns {[]} */
        gridHeaders() {
            if (!this.view) return [];

            /** @type {View} */
            const thisView = this.view;

            let headers = thisView.definition.fields.map(item => {
                return {
                    text: this.$options.filters.translate(item.labelKey),
                    value: item.name
                };
            });

            let showActionsColumn = false;
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableRowButton) {
                    showActionsColumn = true;
                    break;
                }
            }

            if (showActionsColumn)
                headers.push({
                    text: '',
                    value: 'actions',
                    sortable: false,
                    groupable: false,
                    align: 'end',
                });

            return headers;
        },
        /** @returns {Number} */
        gridTotal() {
            if (!this.viewData || !this.viewData.data || this.viewData.data.length <= 0) return 0;
            return this.viewData.count;
        },
        /** @returns {[]} */
        gridRecords() {
            if (!this.viewData || !this.viewData.data || this.viewData.data.length <= 0) return [];
            return this.viewData.data;

            // let expressionEvaluators = [];
            // for (let hilite of this.viewDefinition.view.hilites) {
            //     let evaluator = {
            //         eval: LowLevelUtils.makeExpessionEvaluator(this.viewData.data[0], hilite.condition),
            //         cssClasses: []
            //     };

            //     if (hilite.background) evaluator.cssClasses.push(...[LowLevelUtils.cssClassNameSanitizer(hilite.background), "lighten-4"]);
            //     if (hilite.color) evaluator.cssClasses.push(`${hilite.color}--text`);

            //     expressionEvaluators.push(evaluator);
            // }

            // let records = [];
            // for (let item of this.viewData.data) {
            //     let record = {
            //         id: item.id
            //     };

            //     for (let field of this.view.definition.fields) {
            //         if (!Object.prototype.hasOwnProperty.call(item, field.name))
            //             record[field.name] = null;
            //         else if (field.targetName) {
            //             record[`__${field.name}`] = item[field.name];
            //             record[field.name] = item[field.name] != null ? item[field.name][field.targetName] : null;
            //         } else if (field.selectionList && field.selectionList.length > 0) {
            //             record[`__${field.name}`] = item[field.name];
            //             let label = field.selectionList.find(l => l.value == item[field.name]).title;
            //             record[field.name] = item[field.name] != null ? label : null;
            //         }
            //         else
            //             record[field.name] = item[field.name];
            //     }

            //     for (let evaluator of expressionEvaluators) {
            //         if (evaluator.eval(item))
            //             record.__cssClasses = evaluator.cssClasses;
            //     }

            //     records.push(record);
            // }

            // return records;
        },
    },
    methods: {
        onPageChange(/** @type {Number} */ pageNumber) {
            this.viewDataPageNumber = pageNumber;
            this.loadData();
        },
        onRefresh() {
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
        onEditItem(item) {
            let formViewContext = Object.assign({}, this.viewContext);
            formViewContext.viewType = "form";
            formViewContext.context._id = item.id;
            this.$store.dispatch($.actions.APP_OPEN_VIEW, formViewContext);
        },
        onDoubleClickRow(event, row) {
            this.onEditItem(row.item);
        },
        getViewIcon(/** @type {string} */ viewType) {
            switch (viewType) {
                case "cards":
                    return 'mdi-card-text';
                case "grid":
                    return "mdi-table-large";
                case "form":
                    return "mdi-form-textbox";
                case "calendar":
                    return "mdi-calendar-month";
                default:
                    return "mdi-view-compact";
            }
        },
        // eslint-disable-next-line no-unused-vars
        rowStyle(item) {
            let cssClasses = ["bordered-cell", "alternate-row"];
            if (item.__cssClasses)
                cssClasses.push(...item.__cssClasses);

            return cssClasses;
        },
        async loadData() {
            this.viewDataLoading = true;

            /** @type {View} */
            const thisView = this.view;

            const query = new Query();
            query.entity = thisView.definition.entity;
            query.fields = thisView.definition.fields.map(item => { return item.name; });
            query.filters = thisView.definition.filters;
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
            else if (thisView.definition.sorts) {
                query.sorts = thisView.definition.sorts;
            }

            this.viewData = await this.$store.getters[$.getters.APP_GET_RECORDS](query);
            this.viewDataLoading = false;
        },
        computeCssColor(/** @type {String} */ color) {
            if (!color)
                return 'var(--v-tertiary-base)';
            else if (color == 'primary' || color == 'secondary' || color == 'tertiary')
                return `var(--v-${color}-base)`;
            else
                return color;
        },
        computeColor(/** @type {String} */ color) {
            if (!color)
                return 'tertiary';
            else
                return color;
        }
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

/* .actionsCell {
    margin-left: -16px;
    margin-right: -12px;
} */
</style>
