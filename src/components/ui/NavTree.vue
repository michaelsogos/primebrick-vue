<template>
    <v-list dense tile class="px-0">
        <h-nav-tree-item
            :node="item"
            v-for="item in items"
            :key="item.id"
            :ref="`${item.id}_${item.key}` "
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
