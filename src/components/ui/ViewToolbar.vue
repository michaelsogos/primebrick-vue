<template >
    <v-toolbar
        dense
        flat
        tile
        :color="`${computeColor(view.color)} lighten-5`"
        height="46"
        :style="
            `border-bottom: 2px solid ${computeCssColor(view.color)} !important`
        "
    >
        <v-btn
            text
            tile
            class="caption primary--text"
            v-if="checkToolbarButtonVisibility('add')"
            @click="onAddItem()"
        >
            <v-icon left>mdi-plus</v-icon>
            {{ "add" | translate }}
        </v-btn>
        <v-btn
            text
            tile
            class="caption error--text"
            v-if="checkToolbarButtonVisibility('delete')"
            @click="$emit('delete-items')"
        >
            <v-icon left>mdi-delete-alert</v-icon>
            {{ "delete" | translate }}
        </v-btn>
        <v-btn
            text
            tile
            class="caption error--text"
            v-if="checkToolbarButtonVisibility('archive')"
            @click="$emit('archive-items')"
        >
            <v-icon left>mdi-trash-can</v-icon>
            {{ "archive" | translate }}
        </v-btn>
        <v-btn
            text
            tile
            class="caption primary--text"
            @click="$emit('refresh')"
            v-if="checkToolbarButtonVisibility('refresh')"
        >
            <v-icon left>mdi-refresh</v-icon>
            {{ "refresh" | translate }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
            solo
            single-line
            flat
            dense
            clearable
            @click.stop
            hide-details
            prepend-inner-icon="mdi-magnify"
            :label="'search' | translate"
            color="primary"
            :background-color="`${computeColor(view.color)} lighten-4`"
            type="search"
            style="max-width:400px;"
            @change="$emit('search', viewSearchTerm)"
            v-model="viewSearchTerm"
            v-if="checkToolbarButtonVisibility('search')"
        ></v-text-field>
        <v-btn-toggle
            v-if="view.alternativeViews && view.alternativeViews.length > 0"
            :value="0"
            background-color="transparent"
            group
            :color="computeColor(view.color)"
            class="pa-0 ma-0"
        >
            <v-btn :title="view.definition.type">
                <v-icon>{{ getViewIcon(view.definition.type) }}</v-icon>
            </v-btn>
            <template v-for="item in view.alternativeViews">
                <v-btn :key="item.type" :title="item.type">
                    <v-icon>{{ getViewIcon(item.type) }}</v-icon>
                </v-btn>
            </template>
        </v-btn-toggle>
        <v-menu offset-y tile>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    color="primary"
                    small
                    v-on="on"
                    v-if="checkMenuVisibility()"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-list
                dense
                rounded
                dark
                :class="[`${computeColor('primary')}`, 'pa-1', 'ma-0']"
            >
                <v-list-item
                    v-for="(item, idx) in getMenuLink()"
                    :key="idx"
                    @click="onOpenLink(item)"
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                        item.labelKey | translate
                    }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script>
import $ from "../../store/types";
import { OpenView } from 'src/models/OpenView';
// eslint-disable-next-line no-unused-vars
import { View } from 'src/models/View';

export default {
    name: "h-view-toolbar",
    props: {
        view: Object,
    },
    data: function () {
        return {
            viewSearchTerm: null,
        };
    },
    methods: {
        onAddItem() {
            /** @type {View} */
            const thisView = this.view;
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(thisView, thisView.actions.add.view, null));
        },
        onOpenLink(/** @type {{ labelKey: String, view: String, action: String, icon: String }} */link) {
            switch (link.action) {
                case "add":
                    this.onAddItem();
                    break;
                case "delete":
                    this.$emit('onDeleteItems');
                    break;
                case "archive":
                    this.$emit('onArchiveItems');
                    break;
                case "refresh":
                    this.$emit('onRefresh');
                    break;
            }
        },
        /** @returns {String} */
        computeColor(/** @type {String} */ color) {
            if (!color) return "tertiary";
            else return color;
        },
        /** @returns {String} */
        computeCssColor(/** @type {String} */ color) {
            if (!color)
                return 'var(--v-tertiary-base)';
            else if (color == 'primary' || color == 'secondary' || color == 'tertiary')
                return `var(--v-${color}-base)`;
            else
                return color;
        },
        /** @returns {Boolean} */
        checkToolbarButtonVisibility(/** @type {string} */ actionName) {
            /** @type {View} */
            const thisView = this.view;
            return thisView.actions && thisView.actions[actionName] && thisView.actions[actionName].enableToolbarButton == true;
        },
        /** @returns {String} */
        getViewIcon(/** @type {string} */ viewType) {
            switch (viewType) {
                case "cards":
                    return 'mdi-card-text';
                case "grid":
                    return "mdi-table-large";
                case "form":
                    return "mdi-form-textbox";
                case "calendar":
                    return "mdi-calendar-month";
                default:
                    return "mdi-view-compact";
            }
        },
        /** @returns {Boolean} */
        checkMenuVisibility() {
            /** @type {View} */
            const thisView = this.view;

            let showMenu = false;
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableMenuLink == true) {
                    showMenu = true;
                    break;
                }
            }

            return showMenu;
        },
        /** @returns {{ labelKey: String, view: String, action: String, icon: String }[]} */
        getMenuLink() {
            /** @type {View} */
            const thisView = this.view;

            const links = [];
            for (const action in thisView.actions) {
                if (thisView.actions[action].enableMenuLink == true) {
                    links.push({ labelKey: action, view: thisView.actions[action].view, action: action, icon: this.getActionIcon(action) });
                }
            }

            return links;
        },
        /** @returns {String} */
        getActionIcon(/** @type {string} */ actionName) {
            switch (actionName) {
                case "add":
                    return 'mdi-plus';
                case "delete":
                    return 'mdi-delete-alert';
                case "archive":
                    return 'mdi-trash-can';
                case "refresh":
                    return 'mdi-refresh';
                default:
                    return "";
            }
        },
    }
};
</script>
