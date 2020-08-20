<template>
    <v-container fluid fill-height class="pa-0 ma-0 align-content-start">
        <h-panel>
            <template v-slot:header>
                <v-tabs
                    v-model="$store.state.app.viewTabIndex"
                    background-color="grey lighten-3"
                    :style="`border-bottom: 2px solid ${sliderColor||'primary'}`"
                    :hide-slider="true"
                >
                    <v-tab
                        v-for="(item,index) in viewTabs"
                        :key="item.actionId"
                        class="py-0 pl-2 pr-1 caption text-capitalize"
                        :style="tabStyle(item)"
                        @click="onClickTab(item)"
                        active-class="tab-item-selected"
                    >
                        <v-icon small class="mr-2">{{item.icon}}</v-icon>
                        <span class="primary--text">{{ item.title }}</span>
                        <v-btn
                            small
                            icon
                            class="ma-0 ml-3 primary--text"
                            @click.stop="onCloseTab(index)"
                        >
                            <v-icon color="error" small>mdi-close-box</v-icon>
                        </v-btn>
                    </v-tab>
                </v-tabs>
            </template>
            <template v-slot:footer>
                <div></div>
            </template>
            <v-tabs-items v-model="$store.state.app.viewTabIndex" class="fill-height">
                <v-tab-item
                    v-for="(item,index) in viewTabs"
                    :key="item.actionId"
                    class="fill-height"
                >
                    <component :is="loadView(index)" :view-context="item" ref="activeView"></component>
                </v-tab-item>
            </v-tabs-items>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../store/types";

// eslint-disable-next-line no-unused-vars
import { ViewContext } from "../models/ViewContext";

export default {
    name: 'page-main',
    data: () => ({
        sliderColor: 'primary'
    }),
    computed: {
        /** @returns {ViewContext[]} */
        viewTabs() {
            return this.$store.state.app.viewTabs;
        },
        /** @returns {Number} */
        viewTabIndex() {
            return this.$store.state.app.viewTabIndex;
        }
    },
    watch: {
        viewTabIndex(newValue) {
            this.sliderColor = this.viewTabs[newValue].color;
        }
    },
    methods: {
        onClickTab(/** @type {ViewContext} */ viewTab) {
            this.sliderColor = viewTab.color;
        },
        onCloseTab(/** @type {Number} */ tabIndex) {
            this.$store.commit($.mutations.APP_REMOVE_VIEWTAB, tabIndex);
        },
        tabStyle(/** @type {ViewContext} */ viewTab) {
            return `color: ${viewTab.color}; border-right: 1px solid #d0d0d0;`;
        },
        loadView(/** @type {Number} */ tabIndex) {
            return `view-${this.viewTabs[tabIndex].viewType}`;
        }
    },
    mounted() {
        let self = this;
        this._keyListener = function (/** @type {KeyboardEvent} */ e) {
            //To handle VIEW REFRESH
            if ((e.key === "r" && (e.ctrlKey || e.metaKey)) || (e.keyCode === 116 && !e.ctrlKey && !e.metaKey)) { //CTRL+R or F5
                e.preventDefault();
                self.$refs.activeView[0].onRefresh();
            }

            //To handle VIEW SAVE
            if ((e.key === "s" && (e.ctrlKey || e.metaKey))) { //CTRL+S
                e.preventDefault();

            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
        this.$store.dispatch($.actions.APP_EXEC_OPTIN);

    },
    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    }
}
</script>

<style>
.tab-item-selected::before {
    background-color: currentColor;
    opacity: 0.2 !important;
}
</style>