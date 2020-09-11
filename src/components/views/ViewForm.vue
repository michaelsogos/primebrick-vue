<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0 blue-grey lighten-4">
        <h-panel>
            <template v-slot:header>
                <h-view-toolbar
                    :view="view"
                    @save="onSave"
                    @edit="onEdit"
                    @delete="onDelete"
                    @archive="onArchive"
                    @refresh="onRefresh"
                    @info="onInfo"
                ></h-view-toolbar>
                <v-expand-transition>
                    <v-alert type="error" border="left" class="ma-0 my-2" dense elevation="0" light v-if="!formValidity">
                        {{ "form-validation-failed" | translate }}
                        <ul style="max-height: 200px; overflow: auto">
                            <template v-for="field in getNotValidFields">
                                <li :key="field.name">
                                    {{ "not-valid-input-field" | translate({ name: field.name }) }}
                                    <ul>
                                        <li v-for="(error, index) in field.errors" :key="index">{{ error }}</li>
                                    </ul>
                                </li>
                            </template>
                        </ul>
                    </v-alert>
                </v-expand-transition>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-form v-if="viewData" ref="form" v-model="formValidity" :readonly="view.readonly" class="pa-0 ma-0">
                <v-row no-gutters>
                    <template v-for="(item, index) in getContainers">
                        <v-col
                            cols="12"
                            :lg="item.cols || 12"
                            :key="index"
                            :class="['px-2', 'mt-2', index != getContainers.length - 1 ? 'mb-2' : 'mb-0']"
                        >
                            <v-card class="pa-4">
                                <v-row>
                                    <template v-for="(field, index) in item.fields">
                                        <v-col :cols="field.cols || 12" :key="index">
                                            <v-checkbox
                                                v-if="field.type && field.type == 'checkbox'"
                                                dense
                                                :label="field.labelKey | translate"
                                                v-model="viewData[field.name]"
                                                :required="field.require"
                                            ></v-checkbox>

                                            <v-switch
                                                v-else-if="field.type && field.type == 'switch'"
                                                dense
                                                :label="field.labelKey | translate"
                                                v-model="viewData[field.name]"
                                                :required="field.require"
                                            ></v-switch>

                                            <v-text-field
                                                v-else
                                                outlined
                                                dense
                                                :label="field.labelKey | translate"
                                                placeholder=" "
                                                v-model="viewData[field.name]"
                                                :required="field.require"
                                                :rules="getFieldValidationRules(field)"
                                            ></v-text-field>
                                        </v-col>
                                    </template>
                                </v-row>
                            </v-card>
                        </v-col>
                    </template>
                </v-row>
            </v-form>
        </h-panel>
        <v-navigation-drawer absolute v-model="showInfoDialog" right v-if="showInfoDialog" temporary color="primary" dark>
            <v-list dense two-line>
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-history</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "version" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.version }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-calendar-clock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "created-on" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.createdOn }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "created-by" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.createdBy }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-calendar-clock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "updated-on" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.updatedOn }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "updated-by" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.updatedBy }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-calendar-clock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "deleted-on" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.deletedOn || "-" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "deleted-by" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.deletedBy || "-" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-calendar-clock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "imported-on" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.importedOn || "-" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon class="secondary">mdi-account</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ "imported-by" | translate }}</v-list-item-title>
                        <v-list-item-subtitle>{{ info.importedBy || "-" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { Query } from 'src/models/Query';
// eslint-disable-next-line no-unused-vars
import { View, ViewFilter, ViewFormDefinition, ViewContainer, ViewContainerField } from 'src/models/View';
import { SaveEntity } from 'src/models/SaveEntity';
import { EntityInfo } from 'src/models/EntityInfo';

export default {
    name: "view-form",
    props: {
        view: Object
    },
    data: function () {
        return {
            viewData: null,
            formValidity: true,
            showInfoDialog: false,
            /** @type {EntityInfo} */
            info: new EntityInfo()
        };
    },
    computed: {
        /** @returns {ViewContainer[]} */
        getContainers() {
            if (!this.view) return [];

            /** @type {View} */
            const thisView = this.view;
            return thisView.definition.containers;
        },
        /** @returns {{name:String, errors: String[]}[]} */
        getNotValidFields() {
            const fields = [];

            if (this.$refs.form)
                for (const input of this.$refs.form.inputs) {
                    if (!input.$data.valid) {
                        fields.push({
                            name: input.$props.label,
                            errors: input.$data.errorBucket
                        });
                    }
                }

            console.log(fields);
            return fields;
        }
    },
    methods: {
        onSave() {
            if (!this.formValidity) return;

            /** @type {View} */
            const thisView = this.view;

            this.$store.dispatch($.actions.APP_SAVE_ENTITY, new SaveEntity(thisView.definition.entity, this.viewData)).then((entity) => this.viewData = entity);
        },
        onEdit() {
            this.view.readonly = false;
        },
        onDelete() {
            alert(this.view.entityId);
        },
        onArchive() {
            alert(this.view.entityId);
        },
        onRefresh() {
            this.loadData();
        },
        onInfo() {
            /** @type {View} */
            const thisView = this.view;

            if (!thisView.entityId) {
                this.info = null;
                this.showInfoDialog = true;
            }
            else {
                const query = new Query();
                query.entity = thisView.definition.entity;

                const searchFilter = new ViewFilter();
                searchFilter.expressionValues = {};
                searchFilter.expressionValues["id"] = thisView.entityId;
                searchFilter.expressions.push(`$self.id = :id`);
                query.filters.push(searchFilter);

                this.$store.getters[$.getters.APP_GET_RECORDINFO](query).then((result) => {
                    this.info = result;
                    this.showInfoDialog = true;
                });
            }

        },
        /** @returns {Array} */
        getFieldValidationRules(/** @type {ViewContainerField} */ field) {
            const rules = [];

            if (field.validationRules)
                for (let validationRule of field.validationRules) {
                    switch (validationRule.rule) {
                        case "required":
                            rules.push((v) => !!v || this.$options.filters.translate(validationRule.labelKey));
                            break;
                    }
                }

            return rules;
        },
        async loadData() {
            /** @type {View} */
            const thisView = this.view;

            if (!thisView.entityId)
                this.viewData = {};
            else {
                const query = new Query();
                query.entity = thisView.definition.entity;

                const searchFilter = new ViewFilter();
                searchFilter.expressionValues = {};
                searchFilter.expressionValues["id"] = thisView.entityId;
                searchFilter.expressions.push(`$self.id = :id`);
                query.filters.push(searchFilter);

                this.viewData = await this.$store.getters[$.getters.APP_GET_RECORD](query);
            }

            setTimeout(() => this.$refs.form.validate(), 0);
        },
        checkIsSaveEnable() {
            /** @type {View} */
            const thisView = this.view;

            if (!thisView.actions || !thisView.actions.save) this.view.readonly = true;
        }
    },
    mounted() {
        this.checkIsSaveEnable();

        this.loadData().catch(ex => {
            console.error(ex);
            alert(ex.message);
        });
    }
}
</script>

     