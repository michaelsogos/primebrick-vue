<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0">
        <h-panel>
            <template v-slot:header>
                <v-toolbar
                    dense
                    flat
                    tile
                    color="grey lighten-2"
                    height="36"
                    style="border-bottom: 12px solid #ff0000"
                >
                    <v-btn text tile class="caption primary--text">
                        <v-icon small left>fa-plus</v-icon>add
                    </v-btn>
                    <v-btn text tile class="caption error--text">
                        <v-icon small left>fa-trash</v-icon>delete
                    </v-btn>
                    <v-btn text tile class="caption primary--text" @click="onRefresh">
                        <v-icon small left>fa-refresh</v-icon>aggiorna
                    </v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn-toggle
                        v-if="viewContext.views.length > 1"
                        :value="viewButtonSelected"
                        dark
                        mandatory
                    >
                        <template v-for="(item) in viewContext.views">
                            <v-btn :key="item.type" small color="secondary">
                                <v-icon small>{{getViewIcon(item)}}</v-icon>
                            </v-btn>
                        </template>
                    </v-btn-toggle>-->
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
                                firstIcon: 'fa-angle-double-left',
                                lastIcon: 'fa-angle-double-right',
                                prevIcon: 'fa-angle-left',
                                nextIcon: 'fa-angle-right',
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
                            v-if="viewDefinition.view.editIcon"
                            small
                            class="mr-2"
                            @click="onEditItem(item)"
                        >fa-pencil</v-icon>
                        <v-icon small class="mr-2" @click="onEditItem(item)">fa-trash</v-icon>
                    </div>
                </template>
            </v-data-table>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../../store/types";
// eslint-disable-next-line no-unused-vars
import { ViewType } from '../../models/ViewContext';
// eslint-disable-next-line no-unused-vars
import { ViewGridDefinition } from "../../models/ViewGridDefinition";
// eslint-disable-next-line no-unused-vars
import { SearchResult } from "../../models/SearchResult";
import { LowLevelHelpers } from "../../utils/LowLevelHelpers";
import { View } from 'src/models/View';

export default {
    name: "view-grid",
    props: {
        view: View,
    },
    data: function () {
        return {
            viewButtonSelected: null,
            /** @type {ViewGridDefinition} */
            viewDefinition: null,
            /** @type {ViewType} */
            viewType: null,
            /** @type {SearchResult} */
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
            if (!this.viewDefinition) return [];

            let headers = this.viewDefinition.view.items.map(item => {
                return {
                    text: item.title || this.viewDefinition.fields.find(field => field.name == item.name).title,
                    value: item.name,
                    width: item.width,
                    groupable: item.name == 'statusSelect' ? true : false
                };
            });

            if (this.viewDefinition.view.editIcon)
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
            return this.viewData.total;
        },
        /** @returns {[]} */
        gridRecords() {
            if (!this.viewData || !this.viewData.data || this.viewData.data.length <= 0) return [];

            let expressionEvaluators = [];
            for (let hilite of this.viewDefinition.view.hilites) {
                let evaluator = {
                    eval: LowLevelHelpers.makeExpessionEvaluator(this.viewData.data[0], hilite.condition),
                    cssClasses: []
                };

                if (hilite.background) evaluator.cssClasses.push(...[LowLevelHelpers.cssClassNameSanitizer(hilite.background), "lighten-4"]);
                if (hilite.color) evaluator.cssClasses.push(`${hilite.color}--text`);

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
                    else if (field.targetName) {
                        record[`__${field.name}`] = item[field.name];
                        record[field.name] = item[field.name] != null ? item[field.name][field.targetName] : null;
                    } else if (field.selectionList && field.selectionList.length > 0) {
                        record[`__${field.name}`] = item[field.name];
                        let label = field.selectionList.find(l => l.value == item[field.name]).title;
                        record[field.name] = item[field.name] != null ? label : null;
                    }
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
        }
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
            // this.viewContext.viewType = "form"; //@mso -> It will change dynamically the view type remaining on the same tab (like axelor do)

        },
        onDoubleClickRow(event, row) {
            this.onEditItem(row.item);
        },
        getViewIcon(/** @type {ViewType} */ viewType) {
            switch (viewType.type) {
                case "cards":
                    return 'fa-th';
                case "grid":
                    return "fa-list";
                case "form":
                    return "fa-file-text-o";
                case "calendar":
                    return "fa-calendar";
                default:
                    return "fa-external-link";
            }
        },
        // eslint-disable-next-line no-unused-vars
        rowStyle(item) {
            let cssClasses = ["bordered-cell", "alternate-row"];
            if (item.__cssClasses)
                cssClasses.push(...item.__cssClasses);

            return cssClasses;
        },
        async loadViewDefinition() {
            this.viewDefinition = await this.$store.getters[$.getters.APP_GET_VIEWDEFINITION](this.viewContext.context, this.viewType, this.viewContext.model);
        },
        async loadData() {
            this.viewDataLoading = true;
            let dataFields = this.viewDefinition.fields.map(item => { return item.name; });
            let sortFields = [];
            if (this.viewDataSortFields.length > 0) {
                for (let idx = 0; idx < this.viewDataSortFields.length; idx++) {
                    sortFields.push(`${this.viewDataSortDirections[idx] ? '-' : ''}${this.viewDataSortFields[idx]}`);
                }
            }
            else
                sortFields.push(this.viewDefinition.view.orderBy);

            this.viewData = await this.$store.getters[$.getters.APP_GET_RECORDS](this.viewContext.context, this.viewContext.domain, this.viewContext.model, dataFields, 50, (this.viewDataPageNumber - 1) * 50, sortFields);
            this.viewDataLoading = false;
        }
    },
    mounted() {
        let self = this;
        this.viewButtonSelected = this.viewContext.views.findIndex((item) => item.type == this.viewContext.viewType);
        this.viewType = this.viewContext.views[this.viewButtonSelected];
        this.loadViewDefinition().then(() => {
            self.loadData().catch(ex => {
                console.error(ex);
                alert(ex.message);
            });
        }).catch(ex => {
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

.actionsCell {
    margin-left: -16px;
    margin-right: -12px;
}
</style>
