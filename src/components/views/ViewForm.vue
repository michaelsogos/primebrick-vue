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

                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-sheet v-for="item in getViewFormPanels" :key="item.name">
                <span>{{item.name}}</span>
            </v-sheet>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../../store/types";
import { ViewContext } from '../../models/ViewContext';
// eslint-disable-next-line no-unused-vars
import { ViewFormDefinition, ViewFormPanel } from "../../models/ViewFormDefinition";
// eslint-disable-next-line no-unused-vars
import { FetchResult } from "../../models/FetchResult";
// eslint-disable-next-line no-unused-vars
import { ViewType } from '../../models/ViewContext';

export default {
    name: "view-form",
    props: {
        viewContext: ViewContext,
    }, data: function () {
        return {
            /** @type {ViewFormDefinition} */
            viewDefinition: null,
            viewDataLoading: false,
            /** @type {FetchResult} */
            viewData: null,
            /** @type {ViewType} */
            viewType: null,
        };
    },
    computed: {
        /** @returns {ViewFormPanel[]} */
        getViewFormPanels() {
            console.log(this.viewDefinition);
            return this.viewDefinition ? this.viewDefinition.view.items[0].view.items : [];
        }
    },
    methods: {
        async loadViewDefinition() {
            this.viewDefinition = await this.$store.getters[$.getters.APP_GET_VIEWDEFINITION](this.viewContext.context, this.viewType, this.viewContext.model);
            console.log(this.viewDefinition.view.items[0]);
            console.log(this.viewDefinition.view.items[0].view.items);
        },
        async loadData() {
            this.viewDataLoading = true;
            let dataFields = this.viewDefinition.fields.map(item => { return item.name; });
            this.viewData = await this.$store.getters[$.getters.APP_GET_RECORD](this.viewContext.model, dataFields, this.viewContext.context._id);
            this.viewDataLoading = false;
        }
    },
    mounted() {
        let self = this;
        let viewTypeIndex = this.viewContext.views.findIndex((item) => item.type == this.viewContext.viewType);
        this.viewType = this.viewContext.views[viewTypeIndex];
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
