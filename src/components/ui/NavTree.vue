<template>
    <v-list dense tile class="px-0">
        <h-nav-tree-item
            :node="item"
            v-for="(item, index) in menuItems"
            :key="index"
            :ref="`${item.viewName}_${item.labelKey}_${item.orderPriority}`"
        ></h-nav-tree-item>
    </v-list>
</template>

<script>
import NavTreeNode from "./NavTreeNode";

export default {
    name: "h-nav-tree",
    props: {
        items: Array,
    },
    data: function () {
        return {
            /** @type {import("../../models/MenuItem").MenuItem[]*/
            menuItems: this.items
        };
    },
    components: {
        "h-nav-tree-item": NavTreeNode
    },
    methods: {
        collapseAll() {
            for (let ref in this.$refs) {
                this.$refs[ref][0].collapseItem();
            }
        }
    }
};
</script>
