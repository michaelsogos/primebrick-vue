<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start flex-grow-1 flex-shrink-0 blue-grey lighten-4">
        <h-panel>
            <template v-slot:header>
                <h-view-toolbar :view="view" @delete-items="onDeleteItem" @archive-items="onArchiveItem" @refresh="onRefresh"></h-view-toolbar>
                <v-btn @click="test">test</v-btn>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-form v-if="viewData">
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
                                                dense
                                                :label="field.labelKey | translate"
                                                v-model="viewData[field.name]"
                                                v-if="field.type && field.type == 'checkbox'"
                                            ></v-checkbox>

                                            <v-switch
                                                dense
                                                :label="field.labelKey | translate"
                                                v-model="viewData[field.name]"
                                                v-else-if="field.type && field.type == 'switch'"
                                            ></v-switch>

                                            <v-text-field
                                                outlined
                                                dense
                                                :label="field.labelKey | translate"
                                                v-model="viewData[field.name]"
                                                v-else
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
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { Query } from 'src/models/Query';
// eslint-disable-next-line no-unused-vars
import { View, ViewFilter, ViewFormDefinition, ViewContainer } from 'src/models/View';

export default {
    name: "view-form",
    props: {
        view: Object
    },
    data: function () {
        return {
            viewData: null
        };
    },
    computed: {
        /** @returns {ViewContainer[]} */
        getContainers() {
            if (!this.view) return [];

            /** @type {View} */
            const thisView = this.view;
            return thisView.definition.containers;
        }
    },
    methods: {
        test() {
            console.log(Object.assign({}, this.viewData));
        },
        onDeleteItem() {
            alert(this.view.entityId);
        },
        onArchiveItem() {
            alert(this.view.entityId);
        },
        onRefresh() {
            this.loadData();
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

     