<template>
    <v-container fluid fill-height class="pa-2 ma-0 align-content-start">
        <h-panel>
            <template v-slot:header>
                <v-tabs v-model="$store.state.app.viewTabIndex" background-color="transparent" :hide-slider="true">
                    <v-tab
                        v-for="(item, index) in viewTabs"
                        :key="item.name"
                        class="py-0 pl-2 pr-1 caption text-capitalize"
                        :style="tabStyle(item)"
                        @click="onClickTab(item)"
                        active-class="tab-item-selected"
                    >
                        <v-icon small class="mr-2">{{ item.icon }}</v-icon>
                        <span class="primary--text">{{ item.labelKey | translate }}</span>
                        <v-btn small icon class="ma-0 ml-3" @click.stop="onCloseTab(index)">
                            <v-icon small>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-tab>
                </v-tabs>
            </template>
            <template v-slot:footer>
                <h-view-log v-if="showLogsPanel"></h-view-log>
                <div v-else></div>
            </template>
            <v-tabs-items v-model="$store.state.app.viewTabIndex" class="fill-height">
                <v-tab-item v-for="(item, index) in viewTabs" :key="item.name" class="fill-height">
                    <component :is="loadView(index)" :view="item" ref="activeView"></component>
                </v-tab-item>
            </v-tabs-items>
        </h-panel>
    </v-container>
</template>

<script>
import $ from "../store/types";
// eslint-disable-next-line no-unused-vars
import { View } from '../models/View';
import { EventBus } from '../plugins/eventBus';

export default {
    name: 'page-main',
    data: () => ({
        sliderColor: null
    }),
    computed: {
        /** @returns {View[]} */
        viewTabs() {
            return this.$store.state.app.viewTabs;
        },
        /** @returns {Number} */
        viewTabIndex() {
            return this.$store.state.app.viewTabIndex;
        },
        /** @returns {Boolean} */
        showLogsPanel() {
            return this.viewTabs[this.viewTabIndex]?.showLogs || false;
        }
    },
    watch: {
        viewTabIndex(newValue) {
            if (newValue != undefined)
                this.sliderColor = this.computeColor(this.viewTabs[newValue]?.color);
            else
                this.sliderColor = null;
        }
    },
    methods: {
        onClickTab(/** @type {import("../models/View").View} */ viewTab) {
            this.sliderColor = this.computeColor(viewTab.color);
        },
        onCloseTab(/** @type {Number} */ tabIndex) {
            this.$store.commit($.mutations.APP_REMOVE_VIEWTAB, tabIndex);
        },
        tabStyle(/** @type {import("../models/View").View} */ viewTab) {
            return `color: ${this.computeColor(viewTab.color)};background-color: white; border-right: 1px solid #d0d0d0;  border-top: 2px solid #d0d0d0; `;
        },
        loadView(/** @type {Number} */ tabIndex) {
            return `view-${this.viewTabs[tabIndex].type}`;
        },
        computeColor(/** @type {String} */ color) {
            if (!color)
                return 'var(--v-tertiary-base)';
            else if (color == 'primary' || color == 'secondary' || color == 'tertiary')
                return `var(--v-${color}-base)`;
            else
                return color;
        },
        keyListener(/** @type {KeyboardEvent} */ e) {
            //To handle VIEW REFRESH
            if ((e.key === "r" && (e.ctrlKey || e.metaKey)) || (e.keyCode === 116 && !e.ctrlKey && !e.metaKey)) { //CTRL+R or F5
                e.preventDefault();

                const viewId = this.$$store.state.app.viewTabs[this.$$store.state.app.viewTabIndex]?.viewId;
                if (viewId)
                    EventBus.$emit(`view-${viewId}:refresh`);
            }

            //To handle VIEW SAVE
            if ((e.key === "s" && (e.ctrlKey || e.metaKey))) { //CTRL+S
                e.preventDefault();

                const viewId = this.$$store.state.app.viewTabs[this.$$store.state.app.viewTabIndex]?.viewId;
                if (viewId)
                    EventBus.$emit(`view-${viewId}:save`);
            }

            //To handle VIEW EXPORT
            if ((e.key === "e" && (e.ctrlKey || e.metaKey))) { //CTRL+E
                e.preventDefault();

                const viewId = this.$$store.state.app.viewTabs[this.$$store.state.app.viewTabIndex]?.viewId;
                if (viewId)
                    EventBus.$emit(`view-${viewId}:export`);
            }

            //To handle VIEW SELECT ALL
            if ((e.key === "a" && (e.ctrlKey || e.metaKey))) { //CTRL+A
                e.preventDefault();

                const viewId = this.$$store.state.app.viewTabs[this.$$store.state.app.viewTabIndex]?.viewId;
                if (viewId)
                    EventBus.$emit(`view-${viewId}:select-all`);
            }
        }
    },
    mounted() {
        document.addEventListener('keydown', this.keyListener.bind(this));
        this.$store.dispatch($.actions.APP_EXEC_OPTIN);

    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keyListener);
    }
}
</script>

<style>
.tab-item-selected::before {
    background-color: currentColor !important;
    opacity: 0.125 !important;
}

.tab-item-selected {
    border-top: 2px solid currentColor !important;
}
</style>