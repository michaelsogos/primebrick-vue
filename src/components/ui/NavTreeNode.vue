<template>
    <div>
        <v-list-item @click="onClickItem" :input-value="expand" class="my-0" :style="nodeStyle()">
            <v-list-item-icon>
                <v-icon dark :small="isSubTree()">{{nodeItem.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="font-weight-regular">
                <span>{{ nodeItem.labelKey | translate }}</span>
            </v-list-item-title>
            <v-list-item-action v-if="nodeItem.children && nodeItem.children.length">
                <v-icon small dark :class="[expand?'mdi-rotate-180':'']">mdi-chevron-down</v-icon>
            </v-list-item-action>
        </v-list-item>

        <v-list
            v-if="nodeItem.children && nodeItem.children.length"
            v-show="expand"
            tile
            dense
            class="my-0 primary darken-1"
            :style="nodeListStyle()"
        >
            <h-nav-tree-item
                v-for="item in nodeItem.children"
                :node="item"
                :key="`${item.labelKey}_${item.orderPriority}`"
            ></h-nav-tree-item>
        </v-list>
    </div>
</template>

<script>
import $ from "../../store/types";
// eslint-disable-next-line no-unused-vars
import { MenuItem } from 'src/models/MenuItem';

export default {
    name: "h-nav-tree-item",
    props: {
        node: Object
    },
    data: () => ({
        expand: false
    }),
    computed: {
        /** @returns {MenuItem} */
        nodeItem() {
            return this.node;
        }
    },
    methods: {
        onClickItem() {
            if (this.nodeItem.viewName) {
                this.$store.dispatch($.actions.APP_OPEN_VIEW, this.nodeItem);
            }
            else
                this.expand = !this.expand;
        },
        collapseItem() {
            this.expand = false;
        },
        nodeStyle() {
            if (this.$parent.$parent.$options._componentTag == "h-nav-tree")
                return ""; //`border-left: 5px solid ${this.node.color || 'transparent'} !important`;
            else
                return `padding-left: 15px;`;
        },
        nodeListStyle() {
            if (this.$parent.$parent.$options._componentTag == "h-nav-tree")
                return ""; //`border-left: 5px solid ${this.node.color || 'transparent'} !important`;
            else
                return "padding-left: 15px;";
        },
        isSubTree() {
            if (this.$parent.$parent.$options._componentTag == "h-nav-tree")
                return false;
            else
                return true;
        }
    }
};
</script>
