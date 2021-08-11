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
                    @show-archived="onShowArchived"
                    @restore="onRestoreItems"
                ></h-view-toolbar>
            </template>

            <v-btn
                :color="view.color || 'tertiary'"
                absolute
                fab
                dark
                bottom
                right
                style="bottom: 50px"
                @click="onAddItem()"
                v-if="checkFabButtonVisibility()"
                :title="$options.filters.translate('add-new-record')"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-data-table
                :headers="viewGridColumns"
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
                                                :items="stringFilterOperators"
                                                value="CONTAINS"
                                                class="filter-input"
                                                @change="onFilterField(item)"
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
                                                @update:search-input="onLoadFilterItems($event, item)"
                                                @blur="onFilterField(item)"
                                                clearable
                                                :multiple="item.listOptions.enableMultiSelection"
                                                deletable-chips
                                                :small-chips="item.listOptions.enableMultiSelection"
                                                :no-data-text="translate('no-data-message')"
                                                v-if="item.listOptions.query"
                                                item-color="tertiary"
                                                color="tertiary"
                                                :menu-props="{ closeOnClick: true }"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon small>mdi-filter</v-icon>
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
                            v-if="checkRowButtonVisibility(ViewAction.OPEN, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            color="primary"
                            class="mr-2"
                            @click.stop="onOpenItem(item)"
                        >
                            mdi-eye
                        </v-icon>
                        <v-icon
                            v-if="checkRowButtonVisibility(ViewAction.EDIT, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            color="primary"
                            class="mr-2"
                            @click.stop="onEditItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            v-if="checkRowButtonVisibility(ViewAction.DELETE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="error"
                            @click.stop="onDeleteItem(item)"
                        >
                            mdi-delete-alert
                        </v-icon>
                        <v-icon
                            v-if="checkRowButtonVisibility(ViewAction.ARCHIVE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="error"
                            @click.stop="onArchiveItem(item)"
                        >
                            mdi-trash-can
                        </v-icon>
                        <v-icon
                            v-if="checkRowButtonVisibility(ViewAction.RESTORE, item)"
                            :small="!getRowButtonDenseSize()"
                            :dense="getRowButtonDenseSize()"
                            class="mr-2"
                            color="primary"
                            @click.stop="onRestoreItem(item)"
                        >
                            mdi-restore
                        </v-icon>
                    </div>
                </template>
            </v-data-table>

            <template v-slot:footer>
                <h-view-log v-if="view.options.showLogs"></h-view-log>
                <div v-else></div>
            </template>
        </h-panel>
        <v-snackbar v-model="showRecordRecoverSnackbar" :timeout="5000" centered color="info" elevation="24" vertical>
            <v-progress-linear
                v-model="recordRecoverSnackbarCountdown"
                :active="showRecordRecoverSnackbar"
                absolute
                top
                light
                color="info darken-3"
            ></v-progress-linear>
            {{ "cancel-delete-operation-message" | translate }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="showRecordRecoverSnackbar = false">
                    {{ "no" | translate }}
                </v-btn>
                <v-btn text v-bind="attrs" @click="onRecoverDeleteRecord">
                    {{ "yes" | translate }}
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { LowLevelUtils } from "../../common/LowLevelUtils";
import { View, ViewSort, ViewFilter, ViewFilterField, ViewFilterFieldListQueryResultItem, ViewFilterFieldListQuery } from 'src/models/View';
import { Query } from 'src/models/Query';
import { OpenView } from 'src/models/OpenView';
import { ConfirmDialog } from '../../models/ConfirmDialog';
import { StringUtils } from "../../common/StringUtils";
import { DeleteEntity } from '../../models/DeleteEntity';
import { SaveEntity } from '../../models/SaveEntity';
import { DeleteOrArchiveOrRestoreEntities } from "../../models/DeleteOrArchiveOrRestoreEntities";
import { ArchiveOrRestoreEntity } from '../../models/ArchiveOrRestoreEntity';
import { ViewAction } from "../../enums/ViewAction";

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
            /** @type {import("../../models/UnknownEntity").UnknownEntity[]} */
            viewSelectedRows: [],
            viewSearchTerm: null,
            /** @type  {import("../../models/ViewGridHeader").ViewGridHeader[]} */
            viewGridColumns: [],
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
            ],
            recoverableRecord: null,
            recordRecoverSnackbarTimeout: 5000,
            recordRecoverSnackbarCountdown: 0,
            showRecordRecoverSnackbar: false,
            ViewAction,
        };
    },
    computed: {
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
        },
        /** @return {ViewFilterField[]} */
        gridFilterHeaders() {
            const filterHeaders = this.viewGridColumns.map((c) => c.columnFilter || null);
            if (this.view.options.enableMultiSelect) filterHeaders.unshift(null);

            for (const filter of filterHeaders) {
                if (filter && filter.type == 'list' && Array.isArray(filter.listOptions.values)) {
                    for (const value of filter.listOptions.values)
                        value.text = this.$options.filters.translate(value.labelKey);
                }
                if (filter && filter.type == 'list' && filter.listOptions.query) {
                    filter.listOptions.query = Object.assign(new ViewFilterFieldListQuery, filter.listOptions.query);
                }
            }

            return filterHeaders;
        }
    },
    methods: {
        /**
       * @param {String} labelKey
       * @returns {String}
       */
        translate(labelKey) {
            return this.$options.filters.translate(labelKey);
        },
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
        onShowArchived(/** @type {String} */ option) {
            this.viewDefinition.showArchivedEntities = option;
            this.onRefresh();
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
            dialog.yesButtonCallback = () => this.deleteItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async deleteItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch($.actions.APP_DELETE_ENTITY, new DeleteEntity(this.viewDefinition.brick, this.viewDefinition.entity, item.id));
            if (result) {
                this.recoverableRecord = result.data[0];
                this.runRecordRecoverSnackbar();
            }
            window.logger.info(this.$options.filters.translate("entity-deleted-message", { entityName: recordName }));
            this.onRefresh();
        },
        runRecordRecoverSnackbar() {
            this.recordRecoverSnackbarCountdown = 0;
            const progressBarStep = 100 / ((this.recordRecoverSnackbarTimeout - 1000) / 1000);
            const interval = setInterval(() => {
                if (this.recordRecoverSnackbarCountdown >= 100) {
                    clearInterval(interval);
                    return;
                }
                this.recordRecoverSnackbarCountdown += progressBarStep;
            }, 1000);
            this.showRecordRecoverSnackbar = true;
        },
        async onRecoverDeleteRecord() {
            this.showRecordRecoverSnackbar = false;
            await this.$store.dispatch($.actions.APP_SAVE_ENTITY, new SaveEntity(this.viewDefinition.brick, this.viewDefinition.entity, this.recoverableRecord));
            this.onRefresh();
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
                dialog.yesButtonCallback = () => this.deleteItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        /**
         * @param {Number[]} ids
         */
        async deleteItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch($.actions.APP_DELETE_ENTITIES, new DeleteOrArchiveOrRestoreEntities(this.viewDefinition.brick, this.viewDefinition.entity, ids));
            window.logger.info(this.$options.filters.translate("entities-deleted-message", { count: result.count }));
            this.onRefresh();

        },
        onArchiveItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = 'mdi-exclamation-thick';
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
            else if (this.viewSelectedRows.length == 1) {
                this.onArchiveItem(this.viewSelectedRows[0]);
            }
            else {
                const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("archive-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("archive-entity-dialog-message", { entityName });
                dialog.iconColor = "error";
                dialog.icon = 'mdi-trash-can';
                dialog.yesButtonCallback = () => this.archiveItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        onArchiveItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("archive-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("archive-entity-dialog-message", { entityName });
            dialog.iconColor = "error";
            dialog.icon = 'mdi-trash-can';
            dialog.yesButtonCallback = () => this.archiveItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async archiveItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            await this.$store.dispatch($.actions.APP_ARCHIVE_ENTITY, new ArchiveOrRestoreEntity(this.viewDefinition.brick, this.viewDefinition.entity, item.id));
            window.logger.info(this.$options.filters.translate("entity-archived-message", { entityName: recordName }));
            this.onRefresh();
        },
        /**
         * @param {Number[]} ids
         */
        async archiveItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch($.actions.APP_ARCHIVE_ENTITIES, new DeleteOrArchiveOrRestoreEntities(this.viewDefinition.brick, this.viewDefinition.entity, ids));
            window.logger.info(this.$options.filters.translate("entities-archived-message", { count: result.count }));
            this.onRefresh();
        },
        onRestoreItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("restore-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("restore-entity-dialog-message", { entityName });
            dialog.iconColor = "success";
            dialog.icon = 'mdi-restore';
            dialog.yesButtonCallback = () => this.restoreItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async restoreItem(item) {
            const recordName = StringUtils.buildEntityName(this.viewDefinition.entityNameTemplate, item);
            await this.$store.dispatch($.actions.APP_RESTORE_ENTITY, new ArchiveOrRestoreEntity(this.viewDefinition.brick, this.viewDefinition.entity, item.id));
            window.logger.info(this.$options.filters.translate("entity-restored-message", { entityName: recordName }));
            this.onRefresh();
        },
        onRestoreItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = 'mdi-exclamation-thick';
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
            else if (this.viewSelectedRows.length == 1) {
                this.onRestoreItem(this.viewSelectedRows[0]);
            }
            else {
                const entityName = this.$options.filters.translate(this.view.entityNameLabelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("restore-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("restore-entity-dialog-message", { entityName });
                dialog.iconColor = "success";
                dialog.icon = 'mdi-restore';
                dialog.yesButtonCallback = () => this.restoreItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        /**
         * @param {Number[]} ids
         */
        async restoreItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch($.actions.APP_RESTORE_ENTITIES, new DeleteOrArchiveOrRestoreEntities(this.viewDefinition.brick, this.viewDefinition.entity, ids));
            window.logger.info(this.$options.filters.translate("entities-restored-message", { count: result.count }));
            this.onRefresh();
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
        onSearch(/** @type {String} */ searchTerm) {
            this.viewDataPageNumber = 1;
            this.viewSelectedRows = [];
            this.viewSearchTerm = searchTerm;
            this.loadData();
        },
        /**
         * @param {ViewFilterField} filter
         */
        onFilterField(filter) {
            this.viewDataPageNumber = 1;
            this.viewSelectedRows = [];

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

            let filterFieldIndex = this.viewColumnFilters.findIndex((f) => f.field == filter.field);
            if (filterFieldIndex < 0) {
                const filterField = new ViewFilterField();
                filterField.field = filter.field;
                filterField.type = filter.type;
                filterFieldIndex = this.viewColumnFilters.push(filterField) - 1;
            }

            if (filterFieldValue)
                switch (filterFieldOperator) {
                    case "CONTAINS":
                        this.viewColumnFilters[filterFieldIndex].value = `%${filterFieldValue}%`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'LIKE';
                        break;
                    case "STARTSWITH":
                        this.viewColumnFilters[filterFieldIndex].value = `${filterFieldValue}%`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'LIKE';
                        break;
                    case "ENDSWITH":
                        this.viewColumnFilters[filterFieldIndex].value = `%${filterFieldValue}`;
                        this.viewColumnFilters[filterFieldIndex].operator = 'LIKE';
                        break;
                    case "EQUALS":
                        this.viewColumnFilters[filterFieldIndex].value = `${filterFieldValue}`;
                        this.viewColumnFilters[filterFieldIndex].operator = '=';
                        break;
                    case "IN":
                        this.viewColumnFilters[filterFieldIndex].value = filterFieldValue;
                        this.viewColumnFilters[filterFieldIndex].operator = 'IN';
                        break;
                }
            else
                this.viewColumnFilters.splice(filterFieldIndex);


            this.loadData();
        },
        getRowButtonDenseSize() {
            let count = 0;
            for (const action in this.view.actions) {
                if (action == ViewAction.RESTORE && this.view.actions.showArchived) continue;
                if (this.view.actions[action].enableRowButton == true)
                    count += 1;
            }

            return count > 3 ? false : true;
        },
        /** @returns {Boolean} */
        checkRowButtonVisibility(/** @type {string} */ actionName, item) {
            const isVisible = this.view.actions && this.view.actions[actionName] && this.view.actions[actionName].enableRowButton == true || false;
            const archiveFlagFieldName = this.viewDefinition.fields.find((f) => { return f.isArchiveFlag; }).name;
            const isItemArchived = archiveFlagFieldName ? item[archiveFlagFieldName] : false;

            switch (actionName) {
                case ViewAction.EDIT:
                case ViewAction.DELETE:
                case ViewAction.ARCHIVE: {
                    return isVisible && !isItemArchived;
                }
                case ViewAction.RESTORE: {
                    return isVisible && isItemArchived;
                }
                default:
                    return isVisible;
            }

        },
        checkColumnFiltersVisibility() {
            return this.view.actions && this.view.actions.filter && this.view.actions.filter.enableColumns == true;
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
            query.showArchivedEntities = this.viewDefinition.showArchivedEntities;
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
                    if (filterField.operator == 'IN')
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} (:...${filterField.field}_field_filter)`);
                    else
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} :${filterField.field}_field_filter`);
                    columnFilter.expressionValues[`${filterField.field}_field_filter`] = filterField.value;
                }

                if (columnFilter.expressions.length > 0)
                    query.filters.push(columnFilter);
            }

            this.viewData = await this.$store.getters[$.getters.APP_GET_RECORDS](query);
            this.viewDataLoading = false;
        },
        /** @returns {import("../../models/ViewGridHeader").ViewGridHeader[]} */
        buildGridColumns() {
            if (!this.view) return [];

            const headers = [];

            for (const item of this.viewDefinition.fields) {
                if (item.hideColumn == true) continue;

                let filter = null;
                if (this.view.actions && this.view.actions.filter && this.view.actions.filter.enableColumns == true) {
                    filter = this.view.actions.filter.fields.find((f) => f.field == item.name);
                    if (filter) {
                        filter.label = this.$options.filters.translate(item.labelKey);
                    }
                }

                headers.push({
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
                    columnFilter: filter,
                });
            }

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
                    width: `${33 + ((this.getRowButtonDenseSize() ? 24 : 20) * actionButtonsCount)}px`,
                    class: "pa-0"
                });

            return headers;
        },
        /**
        * @param {String} searchTerm
        * @param {ViewFilterField} filter
        */
        async onLoadFilterItems(searchTerm, filter) {
            filter.listOptions.query.loading = true;

            const query = new Query();
            query.brick = filter.listOptions.query.brick;
            query.entity = filter.listOptions.query.entity;
            query.fields = [];
            query.fields.push(filter.listOptions.query.valueFieldName);
            const textField = filter.listOptions.query.textFieldName || filter.listOptions.query.labelKeyFieldName;
            if (textField != filter.listOptions.query.valueFieldName)
                query.fields.push(textField);
            query.filters = [...filter.listOptions.query.filters || []];
            query.showArchivedEntities = filter.listOptions.query.showArchivedEntities;
            query.take = 10;
            query.skip = 0;
            query.sorts = filter.listOptions.query.sorts || [];
            query.excludeIDField = true;

            if (searchTerm) {
                const searchFilter = new ViewFilter();
                searchFilter.leftOperator = "AND";
                searchFilter.expressionOperator = "OR";
                searchFilter.expressionValues = {};
                searchFilter.expressionValues["searchTerm"] = `%${searchTerm}%`;

                for (const searchField of filter.listOptions.query.searchFields) {
                    searchFilter.expressions.push(`$self.${searchField} LIKE :searchTerm`);
                }

                query.filters.push(searchFilter);
            }

            /** @type {import("../../models/QueryResult").QueryResult} */
            const queryResult = await this.$store.getters[$.getters.APP_GET_RECORDS](query);

            if (!filter.listOptions.query.queryResultItems) filter.listOptions.query.queryResultItems = [];
            filter.listOptions.query.queryResultCount = 0;

            if (queryResult) {
                filter.listOptions.query.queryResultItems.splice(0, filter.listOptions.query.queryResultItems.length,
                    ...queryResult.data.map(r => {
                        const item = new ViewFilterFieldListQueryResultItem();
                        item.text = (filter.listOptions.query.labelKeyFieldName
                            ? this.$options.filters.translate(r[filter.listOptions.query.labelKeyFieldName])
                            : r[filter.listOptions.query.textFieldName]);
                        item.value = r[filter.listOptions.query.valueFieldName];
                        return item;
                    }));

                filter.listOptions.query.queryResultCount = queryResult.count;
            }

            filter.listOptions.query.loading = false;
        }
    },
    mounted() {
        this.viewGridColumns.splice(0, this.viewGridColumns.length, ...this.buildGridColumns());
        this.loadData()
            .catch(ex => {
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

.v-data-table--fixed-header > .v-data-table__wrapper > table > tbody > tr > td[role="columnheader"] {
    position: sticky;
    top: 36px;
    background: #fff;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: rgb(255, 255, 255);
    z-index: 2;
}

table > tbody > tr > td[role="columnheader"] .v-text-field.v-text-field--solo .v-input__control {
    min-height: 32px !important;
    padding: 0;
}

.v-list-item__mask {
    color: var(--v-tertiary-base) !important;
}
</style>
