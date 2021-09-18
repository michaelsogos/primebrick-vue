<template >
    <v-tabs icons-and-text v-if="showTabs" v-model="selectedTab" optional>
        <v-progress-linear :active="viewAggregatesLoading" :indeterminate="true" absolute bottom height="2" color="primary"></v-progress-linear>

        <v-tabs-slider :color="sliderColor"></v-tabs-slider>

        <template v-for="(aggregator, index) in this.viewAggregators">
            <v-tab :key="index" :class="['v-tab--active', `${aggregator.color || 'tertiary'}--text`]">
                {{ aggregator.labelKey | translate }}
                <br />
                {{ aggregator.value || "-" }}
            </v-tab>
        </template>
    </v-tabs>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { View } from 'src/models/View';

export default {
    name: "h-view-aggregates-bar",
    props: {
        viewAggregatesLoading: Boolean,
        viewAggregators: {
            default: /** @return {import("../../models/View").ViewAggregator[]} */ () => []
        },
    },
    data: function () {
        return {
            /** @type {Number} */
            selectedTab: null
        };
    },
    watch: {
        viewAggregators() {
            this.selectedTab = null;
        }
    },
    computed: {
        /** @returns {Boolean} */
        showTabs() {
            return this.viewAggregators?.length > 0 || false;
        },
        /** @returns {String} */
        sliderColor() {
            return this.viewAggregators[this.selectedTab]?.color || 'tertiary';
        }
    },
    mounted() {
    }
};
</script>
