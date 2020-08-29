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
                    <v-btn
                        text
                        tile
                        class="caption primary--text"
                        v-if="checkToolbarButtonVisibility('add')"
                        @click="onAddItem()"
                    >
                        <v-icon small left>mdi-plus</v-icon>
                        {{ 'add' | translate}}
                    </v-btn>
                    <v-btn text tile class="caption error--text">
                        <v-icon small left>mdi-trash-can</v-icon>
                        {{ 'delete' | translate}}
                    </v-btn>
                    <v-btn text tile class="caption primary--text" @click="onRefresh">
                        <v-icon small left>mdi-refresh</v-icon>
                        {{ 'refresh' | translate}}
                    </v-btn>

                    <v-spacer></v-spacer>
                    <v-btn-toggle
                        v-if="view.alternativeViews.length > 0"
                        :value="0"
                        background-color="transparent"
                        group
                        :color="computeColor(view.color)"
                        class="pa-0 ma-0"
                    >
                        <v-btn small :title="view.definition.type">
                            <v-icon small>{{getViewIcon(view.definition.type)}}</v-icon>
                        </v-btn>
                        <template v-for="(item) in view.alternativeViews">
                            <v-btn :key="item.type" small :title="item.type">
                                <v-icon small>{{getViewIcon(item.type)}}</v-icon>
                            </v-btn>
                        </template>
                    </v-btn-toggle>

                    <v-menu offset-y tile>
                        <template v-slot:activator="{ on }">
                            <v-btn icon small v-on="on" v-if="checkMenuVisibility()">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>

                        <v-list
                            dense
                            rounded
                            dark
                            :class="[`${computeColor('primary')}`, 'pa-1', 'ma-0']"
                        >
                            <v-list-item
                                v-for="(item, idx) in getMenuLink()"
                                :key="idx"
                                @click="onOpenLink(item)"
                            >
                                <v-list-item-icon>
                                    <v-icon>{{item.icon}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>{{ item.labelKey | translate }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-btn
                :color="computeColor(view.color)"
                fab
                absolute
                dark
                bottom
                right
                style="bottom:50px"
                @click="onAddItem()"
                v-if="checkFabButtonVisibility()"
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
                                itemsPerPageOptions:[50],
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
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.actions="{ item }">
                    <div class="actionsCell">
                        <v-icon
                            v-if="checkRowButtonVisibility('open')"
                            small
                            class="mr-2"
                            @click.stop="onOpenItem(item)"
                        >mdi-eye</v-icon>
                        <v-icon
                            v-if="checkRowButtonVisibility('edit')"
                            small
                            class="mr-2"
                            @click.stop="onEditItem(item)"
                        >mdi-pencil</v-icon>
                        <!--  <v-icon
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
                        >mdi-trash-can</v-icon>-->
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
import { View, ViewNameType, ViewSort, ViewActions } from 'src/models/View';
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
            viewDataSortDirections: [],
            viewSelectedRows: []
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

            let actionButtonsCount = 0;
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableRowButton) {
                    actionButtonsCount++;
                }
                if (thisView.actions[action].enableRowButton) {
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
                    width: (24 * actionButtonsCount),
                    class: "pa-0"
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
            alert(item.id);
        },
        onEditItem(item) {
            let formViewContext = Object.assign({}, this.viewContext);
            formViewContext.viewType = "form";
            formViewContext.context._id = item.id;
            this.$store.dispatch($.actions.APP_OPEN_VIEW, formViewContext);
        },
        onAddItem() {
            /** @type {View} */
            const thisView = this.view;

            alert(thisView.actions.add.view);
        },
        onDoubleClickRow(/** @type {Event}*/event, row) {
            event.stopPropagation();

            /** @type {View} */
            const thisView = this.view;

            if (thisView.actions && thisView.actions.open && thisView.actions.open.enableDoubleClick)
                this.onOpenItem(row.item);
            else if (thisView.actions && thisView.actions.edit && thisView.actions.edit.enableDoubleClick)
                this.onEditItem(row.item);
        },
        onClickRow(rowData, row) {
            row.select(!row.isSelected);
        },
        onClickToolbarButton(/** @type {string} */actionName) {
            /** @type {View} */
            const thisView = this.view;

            if (thisView.actions && thisView.actions[actionName] && thisView.actions[actionName].view)
                alert(thisView.actions[actionName].view);
        },
        onOpenLink(/** @type {{ labelKey: String, view: String, action: String, icon: String }} */link) {
            alert(link.action);
        },
        /** @returns {Boolean} */
        checkRowButtonVisibility(/** @type {string} */ actionName) {
            /** @type {View} */
            const thisView = this.view;

            if (thisView.actions && thisView.actions[actionName] && thisView.actions[actionName].enableRowButton)
                return true;
            else false;
        },
        /** @returns {Boolean} */
        checkToolbarButtonVisibility(/** @type {string} */ actionName) {
            /** @type {View} */
            const thisView = this.view;

            if (thisView.actions && thisView.actions[actionName] && thisView.actions[actionName].enableToolbarButton)
                return true;
            else false;
        },
        /** @returns {Boolean} */
        checkMenuVisibility() {
            /** @type {View} */
            const thisView = this.view;

            let showMenu = false;
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableMenuLink == true) {
                    showMenu = true;
                    break;
                }

            }

            return showMenu;
        },
        checkFabButtonVisibility() {
            /** @type {View} */
            const thisView = this.view;

            if (thisView.actions && thisView.actions.add && thisView.actions.add.enableFloatingButton == true)
                return true;
            else false;
        },
        /** @returns {Boolean} */
        getGridOption(/** @type {string} */ optionName) {
            /** @type {View} */
            const thisView = this.view;

            if (thisView.options) {
                if (thisView.options[optionName] == true) return true;
                else return false;
            }
            else return false;
        },
        /** @returns {{ labelKey: String, view: String, action: String, icon: String }[]} */
        getMenuLink() {
            /** @type {View} */
            const thisView = this.view;

            const links = [];
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableMenuLink == true) {
                    links.push({ labelKey: action, view: thisView.actions[action].view, action: action, icon: this.getActionIcon(action) });
                }

            }

            return links;
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
        getActionIcon(/** @type {string} */ actionName) {
            switch (actionName) {
                case "add":
                    return 'mdi-plus';
                default:
                    return "";
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
