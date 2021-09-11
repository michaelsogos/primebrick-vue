<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0">
        <h-panel>
            <template v-slot:header>
                <h-view-toolbar
                    :view="view"
                    :appliedFilters="appliedDialogFilters"
                    @delete="onDeleteItems"
                    @archive="onArchiveItems"
                    @refresh="onRefresh"
                    @search="onSearch"
                    @show-archived="onShowArchived"
                    @restore="onRestoreItems"
                    @filter="showFilterDialog = true"
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

            <slot
                name="dataview"
                :deleteItem="onDeleteItem"
                :archiveItem="onArchiveItem"
                :restoreItem="onRestoreItem"
                :changePage="onPageChange"
                :sortField="onSortField"
                :sortDescendant="onSortDescendant"
                :doubleClickRow="onDoubleClickRow"
                :openItem="onOpenItem"
                :editItem="onEditItem"
                :clickRow="onClickRow"
                :showRowButton="checkRowButtonVisibility"
                :pageNumber="viewDataPageNumber"
                :loadFilterItems="onLoadFilterItems"
                :enableMultiSelect="getEnableMultiSelectOption"
                :itemsPerPage="getItemsPerPageOption"
                :filterFields="dialogFilterFields"
            >
                <h1>SLOT DATAVIEW IS EMPTY!</h1>
            </slot>
            <template v-slot:footer>
                <div></div>
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

        <!-- TODO: @mso -> Move this dialog in a separate component and its logic also -->
        <v-dialog max-width="800" v-model="showFilterDialog">
            <v-card>
                <v-toolbar dense color="grey lighten-3" flat>
                    <v-toolbar-title>
                        {{ "filters-dialog-title" | translate }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon color="primary" @click="showFilterDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col class="py-0">
                            <v-radio-group v-model="dialogFiltersSelectedOperator" value="AND">
                                <v-radio :label="translate('filter-and-operator')" value="AND"></v-radio>
                                <v-radio :label="translate('filter-or-operator')" value="OR"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="11" class="py-0">
                            <v-select
                                outlined
                                dense
                                :label="translate('select-field')"
                                :items="dialogFilterFields"
                                item-text="label"
                                return-object
                                v-model="dialogFiltersSelectedField"
                            ></v-select>
                        </v-col>
                        <v-col cols="1" class="py-0">
                            <v-btn icon color="success" @click="onAddFilter">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <template v-for="(filter, index) in this.viewDialogFilters">
                        <v-divider class="my-3" :key="`dialog-filters-divider-${index}`"></v-divider>
                        <v-row :key="`dialog-filters-row-${index}`">
                            <v-col align-self="center">
                                <div class="primary--text font-weight-bold">{{ filter.label }}</div>
                            </v-col>
                            <v-col cols="3" align-self="center">
                                <v-select
                                    hide-details
                                    outlined
                                    flat
                                    dense
                                    :items="getStringFieldOperator()"
                                    color="tertiary"
                                    :label="translate('select-operator')"
                                    v-if="filter.type == 'string'"
                                    :menu-props="{ offsetY: true, rounded: '0' }"
                                    v-model="filter.viewModel.selectedOperator"
                                ></v-select>
                                <span v-if="filter.type == 'list'">{{ "equals-to" | translate }}</span>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    hide-details
                                    outlined
                                    flat
                                    dense
                                    clearable
                                    color="tertiary"
                                    type="text"
                                    v-if="filter.type == 'string'"
                                    :label="translate('type-value')"
                                    v-model="filter.viewModel.selectedValue"
                                ></v-text-field>
                                <template v-if="filter.type == 'list'">
                                    <v-autocomplete
                                        hide-details
                                        outlined
                                        flat
                                        dense
                                        :items="filter.listOptions.values"
                                        :label="translate('select-value')"
                                        clearable
                                        :multiple="filter.listOptions.enableMultiSelection"
                                        deletable-chips
                                        :small-chips="filter.listOptions.enableMultiSelection"
                                        v-if="filter.listOptions.values"
                                        item-color="tertiary"
                                        color="tertiary"
                                        :menu-props="{ closeOnClick: true }"
                                        v-model="filter.viewModel.selectedValue"
                                    ></v-autocomplete>
                                    <v-autocomplete
                                        hide-details
                                        outlined
                                        flat
                                        dense
                                        :items="filter.listOptions.query.queryResultItems"
                                        :label="translate('select-value')"
                                        :loading="filter.listOptions.query.loading"
                                        @update:search-input="onLoadFilterItems($event, filter)"
                                        clearable
                                        :multiple="filter.listOptions.enableMultiSelection"
                                        deletable-chips
                                        :small-chips="filter.listOptions.enableMultiSelection"
                                        v-if="filter.listOptions.query"
                                        item-color="tertiary"
                                        :color="filter.listOptions.query.error ? 'error' : 'tertiary'"
                                        :append-icon="filter.listOptions.query.error ? 'mdi-cancel' : '$dropdown'"
                                        :menu-props="{ closeOnClick: true }"
                                        v-model="filter.viewModel.selectedValue"
                                    >
                                        <template v-slot:no-data>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title :class="[filter.listOptions.query.error ? 'error--text' : 'tertiary--text']">
                                                        {{ (filter.listOptions.query.error ? "query-error" : "no-data-message") | translate }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>

                                        <template v-slot:append-item>
                                            <div
                                                v-if="filter.listOptions.query.queryResultItems.length > 10"
                                                class="caption text-end px-4 tertiary--text"
                                            >
                                                {{ "count-items-found" | translate({ count: filter.listOptions.query.queryResultCount }) }}
                                            </div>
                                        </template>
                                    </v-autocomplete>
                                </template>
                            </v-col>
                            <v-col cols="1">
                                <v-btn icon color="error" @click="onRemoveDialogFilter(index)">
                                    <v-icon>mdi-minus</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="onResetDialogFilters">
                        <v-icon left>mdi-filter-remove</v-icon>
                        {{ "reset" | translate }}
                    </v-btn>
                    <v-btn text color="success" :disabled="this.viewDialogFilters.length <= 0" @click="onApplyDialogFilters">
                        <v-icon left>mdi-filter-plus</v-icon>
                        {{ "apply" | translate }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { View, ViewFilter, ViewFieldFilter, ViewSort, ViewFieldFilterListQueryResultItem } from "../../models/View";
import { Query } from '../../models/Query';
import { OpenView } from '../../models/OpenView';
import { ConfirmDialog } from "../../models/ConfirmDialog";
import { StringUtils } from "../../common/StringUtils";
import { DeleteEntity } from '../../models/DeleteEntity';
import { SaveEntity } from '../../models/SaveEntity';
import { DeleteOrArchiveOrRestoreEntities } from '../../models/DeleteOrArchiveOrRestoreEntities';
import { ArchiveOrRestoreEntity } from '../../models/ArchiveOrRestoreEntity';
import { EventBus } from "../../plugins/eventBus";
import { StringFilterOperator } from '../../enums/StringFilterOperator';
import { ViewAction } from '../../enums/ViewAction';

export default {
    name: "view-list-base",
    props: {
        view: View,
        viewFieldFilters: {
            default: /** @return {ViewFieldFilter[]} */ () => []
        },
        viewSelectedRows: {
            default: /** @return {import("../../models/UnknownEntity").UnknownEntity[]} */ () => []
        },
    },
    data: function () {
        return {
            viewDataPageNumber: 1,
            viewDataSortFields: [],
            viewDataSortDirections: [],
            viewSearchTerm: null,
            /** @type { ViewFieldFilter[]} */
            viewDialogFilters: [],
            appliedDialogFilters: 0,
            recoverableRecord: null,
            recordRecoverSnackbarTimeout: 5000,
            recordRecoverSnackbarCountdown: 0,
            showRecordRecoverSnackbar: false,
            showFilterDialog: false,
            dialogFiltersSelectedOperator: 'AND',
            /** @type { ViewFieldFilter} */
            dialogFiltersSelectedField: null,
            showArchivedEntities: this.view.definition?.showArchivedEntities || 'none'
        };
    },
    watch: {
        viewFieldFilters() {
            this.viewDataPageNumber = 1;
            this.loadData();
        }
    },
    computed: {
        /** @return {ViewFieldFilter[]} */
        dialogFilterFields() {
            if (this.view.definition?.actions?.filter)
                for (const filter of this.view.definition.actions.filter.fields) {
                    const fieldLabelKey = this.view.definition.fields.find((f) => f.name == filter.field).labelKey;
                    if (fieldLabelKey)
                        filter.label = this.$options.filters.translate(fieldLabelKey);
                }

            return this.view.definition?.actions?.filter?.fields || [];
        },
        /** @return {Boolean} */
        getEnableMultiSelectOption() {
            return this.view.definition?.options?.enableMultiSelect || false;
        },
        /** @return {Number} */
        getItemsPerPageOption() {
            return this.view.definition?.options?.itemsPerPage || 20;
        }
    },
    methods: {
        /**
         * @param {String} actionName
         * @param {import("../../models/UnknownEntity").UnknownEntity} item
         * @return {Boolean}
         */
        checkRowButtonVisibility(actionName, item) {
            const isVisible = this.view.definition?.actions[actionName]?.enableItemButton || false;
            const archiveFlagFieldName = this.view.definition.fields.find((f) => { return f.isArchiveFlag; }).name;
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
        getStringFieldOperator() {
            const result = StringFilterOperator.map((o) => {
                o.text = this.$options.filters.translate(o.labelKey);
                return o;
            });

            return result;
        },
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
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.definition.actions.open.view, context.id, true));
        },
        onEditItem(item) {
            const context = item || this.viewSelectedRows[0];
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.definition.actions.edit.view, context.id));
        },
        onDoubleClickRow(/** @type {Event}*/event, row) {
            event.stopPropagation();

            if (this.view.definition?.actions?.open?.enableDoubleClick)
                this.onOpenItem(row.item);
            else if (this.view.definition?.actions?.edit?.enableDoubleClick)
                this.onEditItem(row.item);
        },
        onClickRow(rowData, item) {
            item.select(!item.isSelected);
        },
        onRefresh() {
            this.$emit('onReset');
            this.viewDataPageNumber = 1;
            this.viewDataSortFields = [];
            this.viewDataSortDirections = [];
            this.loadData();
        },
        onSearch(/** @type {String} */ searchTerm) {
            this.$emit('onReset');
            this.viewDataPageNumber = 1;
            this.viewSearchTerm = searchTerm;
            this.loadData();
        },
        onShowArchived(/** @type {String} */ option) {
            this.showArchivedEntities = option;
            this.onRefresh();
        },
        onAddItem() {
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.definition.actions.add.view, null));
        },
        checkFabButtonVisibility() {
            if (this.view.definition?.actions?.add?.enableFloatingButton)
                return true;
            else false;
        },
        onDeleteItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entity.labelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("delete-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("delete-entity-dialog-message", { entityName });
            dialog.iconColor = "error";
            dialog.icon = "mdi-delete-alert";
            dialog.yesButtonCallback = () => this.deleteItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async deleteItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch($.actions.APP_DELETE_ENTITY, new DeleteEntity(this.view.brick, this.view.entity.name, item.id));
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
            await this.$store.dispatch($.actions.APP_SAVE_ENTITY, new SaveEntity(this.view.brick, this.view.entity.name, this.recoverableRecord));
            this.onRefresh();
        },
        onDeleteItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = "mdi-exclamation-thick";
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            } else if (this.viewSelectedRows.length == 1) {
                this.onDeleteItem(this.viewSelectedRows[0]);
            } else {
                const entityName = this.$options.filters.translate(this.view.entity.labelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("delete-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("delete-entity-dialog-message", { entityName });
                dialog.iconColor = "error";
                dialog.icon = "mdi-delete-alert";
                dialog.yesButtonCallback = () => this.deleteItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        /**
         * @param {Number[]} ids
         */
        async deleteItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch(
                $.actions.APP_DELETE_ENTITIES,
                new DeleteOrArchiveOrRestoreEntities(this.view.brick, this.view.entity.name, ids)
            );
            window.logger.info(this.$options.filters.translate("entities-deleted-message", { count: result.count }));
            this.onRefresh();
        },
        onArchiveItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = "mdi-exclamation-thick";
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            } else if (this.viewSelectedRows.length == 1) {
                this.onArchiveItem(this.viewSelectedRows[0]);
            } else {
                const entityName = this.$options.filters.translate(this.view.entity.labelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("archive-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("archive-entity-dialog-message", { entityName });
                dialog.iconColor = "error";
                dialog.icon = "mdi-trash-can";
                dialog.yesButtonCallback = () => this.archiveItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        onArchiveItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entity.labelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("archive-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("archive-entity-dialog-message", { entityName });
            dialog.iconColor = "error";
            dialog.icon = "mdi-trash-can";
            dialog.yesButtonCallback = () => this.archiveItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async archiveItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            await this.$store.dispatch($.actions.APP_ARCHIVE_ENTITY, new ArchiveOrRestoreEntity(this.view.brick, this.view.entity.name, item.id));
            window.logger.info(this.$options.filters.translate("entity-archived-message", { entityName: recordName }));
            this.onRefresh();
        },
        /**
         * @param {Number[]} ids
         */
        async archiveItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch(
                $.actions.APP_ARCHIVE_ENTITIES,
                new DeleteOrArchiveOrRestoreEntities(this.view.brick, this.view.entity.name, ids)
            );
            window.logger.info(this.$options.filters.translate("entities-archived-message", { count: result.count }));
            this.onRefresh();
        },
        onRestoreItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            const entityName = this.$options.filters.translate(this.view.entity.labelKey);
            const dialog = new ConfirmDialog();
            dialog.title = this.$options.filters.translate("restore-entity-dialog-title", { entityName });
            dialog.subTitle = recordName || `${this.$options.filters.translate("record")} id: ${item.id}`;
            dialog.message = this.$options.filters.translate("restore-entity-dialog-message", { entityName });
            dialog.iconColor = "success";
            dialog.icon = "mdi-restore";
            dialog.yesButtonCallback = () => this.restoreItem(item);
            this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
        },
        async restoreItem(item) {
            const recordName = StringUtils.buildEntityName(this.view.entity.recordNameTemplate, item);
            await this.$store.dispatch($.actions.APP_RESTORE_ENTITY, new ArchiveOrRestoreEntity(this.view.brick, this.view.entity.name, item.id));
            window.logger.info(this.$options.filters.translate("entity-restored-message", { entityName: recordName }));
            this.onRefresh();
        },
        onRestoreItems() {
            if (this.viewSelectedRows.length <= 0) {
                const dialog = new ConfirmDialog(true);
                dialog.title = this.$options.filters.translate("invalid-action");
                dialog.message = this.$options.filters.translate("no-rows-selected");
                dialog.iconColor = "warning";
                dialog.icon = "mdi-exclamation-thick";
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            } else if (this.viewSelectedRows.length == 1) {
                this.onRestoreItem(this.viewSelectedRows[0]);
            } else {
                const entityName = this.$options.filters.translate(this.view.entity.labelKey);
                const dialog = new ConfirmDialog();
                dialog.title = this.$options.filters.translate("restore-entity-dialog-title", { entityName });
                dialog.subTitle = `${this.$options.filters.translate("selected-records")}: ${this.viewSelectedRows.length}`;
                dialog.message = this.$options.filters.translate("restore-entity-dialog-message", { entityName });
                dialog.iconColor = "success";
                dialog.icon = "mdi-restore";
                dialog.yesButtonCallback = () => this.restoreItems(this.viewSelectedRows.map((r) => r.id));
                this.$store.commit($.mutations.APP_SHOW_CONFIRMDIALOG, dialog);
            }
        },
        /**
         * @param {Number[]} ids
         */
        async restoreItems(ids) {
            /** @type {import("../../models/QueryResult").QueryResult} */
            const result = await this.$store.dispatch(
                $.actions.APP_RESTORE_ENTITIES,
                new DeleteOrArchiveOrRestoreEntities(this.view.brick, this.view.entity.name, ids)
            );
            window.logger.info(this.$options.filters.translate("entities-restored-message", { count: result.count }));
            this.onRefresh();
        },
        async loadData() {
            this.$emit('onDataLoading');

            const query = new Query();
            query.brick = this.view.brick;
            query.entity = this.view.entity.name;
            query.fields = this.view.definition.fields.map(item => { return item.name; });
            query.filters = Array.from(this.view.definition?.filters || []);
            query.showArchivedEntities = this.showArchivedEntities;
            query.take = this.getItemsPerPageOption;
            query.skip = (this.viewDataPageNumber - 1) * this.getItemsPerPageOption;

            if (this.viewDataSortFields.length > 0) {
                for (let idx = 0; idx < this.viewDataSortFields.length; idx++) {
                    const sort = new ViewSort();
                    sort.field = this.viewDataSortFields[idx];
                    sort.direction = this.viewDataSortDirections[idx] ? 'DESC' : 'ASC';
                    query.sorts.push(sort);
                }
            }
            else if (this.view.definition.sorts) {
                query.sorts = this.view.definition.sorts;
            }

            if (this.viewSearchTerm) {
                const searchFilter = new ViewFilter();
                searchFilter.leftOperator = "AND";
                searchFilter.expressionOperator = "OR";
                searchFilter.expressionValues = {};
                searchFilter.expressionValues["searchTerm"] = `%${this.viewSearchTerm}%`;

                for (const searchField of this.view.definition.actions.search.fields) {
                    searchFilter.expressions.push(`$self.${searchField} like :searchTerm`);
                }

                query.filters.push(searchFilter);
            }

            if (this.viewFieldFilters?.length > 0) {
                const columnFilter = new ViewFilter();
                columnFilter.leftOperator = "AND";
                columnFilter.expressionOperator = "AND";
                columnFilter.expressionValues = {};

                for (const filterField of this.viewFieldFilters) {
                    if (filterField.operator == 'IN')
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} (:...${filterField.field}_field_filter)`);
                    else
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} :${filterField.field}_field_filter`);
                    columnFilter.expressionValues[`${filterField.field}_field_filter`] = filterField.value;
                }

                if (columnFilter.expressions.length > 0)
                    query.filters.push(columnFilter);
            }

            this.appliedDialogFilters = 0;
            if (this.viewDialogFilters && this.viewDialogFilters.length > 0) {
                const columnFilter = new ViewFilter();
                columnFilter.leftOperator = "AND";
                columnFilter.expressionOperator = this.dialogFiltersSelectedOperator;
                columnFilter.expressionValues = {};

                for (let idx = 0; idx < this.viewDialogFilters.length; idx++) {
                    const filterField = this.viewDialogFilters[idx];

                    if (!filterField.value || !filterField.operator) continue;

                    if (filterField.operator == 'IN')
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} (:...${filterField.field}_field_filter_${idx})`);
                    else
                        columnFilter.expressions.push(`$self.${filterField.field} ${filterField.operator} :${filterField.field}_field_filter_${idx}`);
                    columnFilter.expressionValues[`${filterField.field}_field_filter_${idx}`] = filterField.value;

                    this.appliedDialogFilters++;
                }

                if (columnFilter.expressions.length > 0)
                    query.filters.push(columnFilter);
            }

            const queryResult = await this.$store.getters[$.getters.APP_GET_RECORDS](query);

            this.$emit('onDataLoaded', queryResult);
        },
        /**
        * @param {String} searchTerm
        * @param {ViewFieldFilter} filter
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
                        const item = new ViewFieldFilterListQueryResultItem();
                        item.text = (filter.listOptions.query.labelKeyFieldName
                            ? this.$options.filters.translate(r[filter.listOptions.query.labelKeyFieldName])
                            : r[filter.listOptions.query.textFieldName]);
                        item.value = r[filter.listOptions.query.valueFieldName];
                        return item;
                    }));

                filter.listOptions.query.queryResultCount = queryResult.count;
                filter.listOptions.query.error = false;
            } else {
                filter.listOptions.query.error = true;
            }

            filter.listOptions.query.loading = false;
        },
        onRemoveDialogFilter(index) {
            this.viewDialogFilters.splice(index, 1);
        },
        onResetDialogFilters() {
            this.viewDialogFilters.splice(0);
            this.loadData();
        },
        onApplyDialogFilters() {
            this.$emit('onReset');
            this.viewDataPageNumber = 1;

            for (const filter of this.viewDialogFilters) {
                if (filter.type == "list") {
                    if (Array.isArray(filter.viewModel.selectedValue)) {
                        filter.viewModel.selectedOperator = "IN";
                    }
                    else {
                        filter.viewModel.selectedOperator = "EQUALS";
                    }
                }

                if (filter.viewModel.selectedValue)
                    switch (filter.viewModel.selectedOperator) {
                        case "CONTAINS":
                            filter.value = `%${filter.viewModel.selectedValue}%`;
                            filter.operator = 'LIKE';
                            break;
                        case "STARTSWITH":
                            filter.value = `${filter.viewModel.selectedValue}%`;
                            filter.operator = 'LIKE';
                            break;
                        case "ENDSWITH":
                            filter.value = `%${filter.viewModel.selectedValue}`;
                            filter.operator = 'LIKE';
                            break;
                        case "EQUALS":
                            filter.value = `${filter.viewModel.selectedValue}`;
                            filter.operator = '=';
                            break;
                        case "IN":
                            filter.value = filter.viewModel.selectedValue;
                            filter.operator = 'IN';
                            break;
                    }
            }

            this.loadData();
        },
        onAddFilter() {
            if (this.dialogFiltersSelectedField) {
                this.viewDialogFilters.push(Object.assign(new ViewFieldFilter, this.dialogFiltersSelectedField));
            }
        },
        onSelectAll() {
            this.$emit('onSelectAll');
        }
    },
    mounted() {
        this.loadData()
            .catch(ex => {
                console.error(ex);
                alert(ex.message);
            });

        EventBus.$on(`view-${this.view.viewId}:refresh`, this.onRefresh);
        EventBus.$on(`view-${this.view.viewId}:select-all`, this.onSelectAll);
    },
    beforeDestroy() {
        EventBus.$off(`view-${this.view.viewId}:refresh`, this.onRefresh);
        EventBus.$off(`view-${this.view.viewId}:select-all`, this.onSelectAll);
    }
}
</script>

