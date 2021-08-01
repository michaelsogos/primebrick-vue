<template >
    <v-toolbar
        dense
        flat
        tile
        :color="`${computeColor(view.color)} lighten-5`"
        height="46"
        :style="`border-bottom: 2px solid ${computeCssColor(view.color)} !important`"
    >
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility('add')" @click="onAddItem">
            <v-icon left>mdi-plus</v-icon>
            {{ "new" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility('save')" @click="$emit('save')">
            <v-icon left>mdi-content-save</v-icon>
            {{ "save" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility('edit')" @click="$emit('edit')">
            <v-icon left>mdi-pencil</v-icon>
            {{ "edit" | translate }}
        </v-btn>
        <v-btn text tile class="caption error--text" v-if="checkToolbarButtonVisibility('delete')" @click="$emit('delete')">
            <v-icon left>mdi-delete-alert</v-icon>
            {{ "delete" | translate }}
        </v-btn>
        <v-btn text tile class="caption error--text" v-if="checkToolbarButtonVisibility('archive')" @click="$emit('archive')">
            <v-icon left>mdi-trash-can</v-icon>
            {{ "archive" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility('refresh')" @click="$emit('refresh')">
            <v-icon left>mdi-refresh</v-icon>
            {{ "refresh" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility('info')" @click="$emit('info')">
            <v-icon left>mdi-information-variant</v-icon>
            {{ "information" | translate }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-select
            v-if="checkToolbarButtonVisibility('showArchived')"
            hide-details
            solo
            flat
            dense
            :items="showArchivedOptions"
            v-model="showArchivedSelectedOption"
            @change="onShowArchived"
            :background-color="`${computeColor(view.color)} lighten-4`"
            style="max-width: 200px"
            color="primary"
            class="mx-1 caption"
        >
            <template v-slot:prepend-inner>
                <v-icon size="18">mdi-trash-can</v-icon>
            </template>
        </v-select>
        <v-text-field
            solo
            single-line
            flat
            dense
            clearable
            @click.stop
            hide-details
            :label="'search' | translate"
            color="primary"
            :background-color="`${computeColor(view.color)} lighten-4`"
            type="search"
            style="max-width: 300px"
            class="mx-1 caption"
            @change="$emit('search', viewSearchTerm)"
            v-model="viewSearchTerm"
            v-if="checkToolbarButtonVisibility('search')"
        >
            <template v-slot:prepend-inner>
                <v-icon size="18">mdi-magnify</v-icon>
            </template>
        </v-text-field>
        <v-spacer></v-spacer>
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
                <v-btn icon color="primary" small v-on="on" v-if="checkMenuVisibility()">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-list dense rounded dark :class="[`${computeColor('primary')}`, 'pa-1', 'ma-0']">
                <v-list-item v-for="(item, idx) in getMenuLink()" :key="idx" @click="onOpenLink(item)">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.labelKey | translate }}</v-list-item-title>
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
        view: View,
    },
    data: function () {
        return {
            viewSearchTerm: null,
            showArchivedOptions: [
                {
                    text: this.$options.filters.translate('do-not-show-archived'),
                    value: 'none'
                },
                {
                    text: this.$options.filters.translate('show-also-archived'),
                    value: 'also'
                },
                {
                    text: this.$options.filters.translate('show-only-archived'),
                    value: 'only'
                }
            ],
            showArchivedSelectedOption: 'none'
        };
    },
    methods: {
        onAddItem() {

            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.actions.add.view, null));
        },
        onOpenLink(/** @type {{ labelKey: String, view: String, action: String, icon: String }} */link) {
            switch (link.action) {
                case "add":
                    this.onAddItem();
                    break;
                case "delete":
                    this.$emit('delete');
                    break;
                case "archive":
                    this.$emit('archive');
                    break;
                case "refresh":
                    this.$emit('refresh');
                    break;
                case "save":
                    this.$emit('save');
                    break;
                case "edit":
                    this.$emit('edit');
                    break;
                case "info":
                    this.$emit('info');
                    break;
            }
        },
        onShowArchived() {
            this.$emit('show-archived', this.showArchivedSelectedOption);
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
            if (actionName == "save" && this.view.readonly) return false;
            if (actionName == "edit" && this.view.readonly) return this.view.actions && this.view.actions.save && this.view.actions.save.enableToolbarButton == true;

            return this.view.actions && this.view.actions[actionName] && this.view.actions[actionName].enableToolbarButton == true;
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
            let showMenu = false;
            for (const action in this.view.actions) {
                if (this.view.actions[action].enableMenuLink == true) {
                    showMenu = true;
                    break;
                }
            }

            return showMenu;
        },
        /** @returns {{ labelKey: String, view: String, action: String, icon: String }[]} */
        getMenuLink() {
            const links = [];
            for (const action in this.view.actions) {
                if (action == "save") {
                    let realAction = action;
                    if (this.view.readonly) realAction = 'edit';
                    if (this.view.actions.save.enableMenuLink == true) {
                        links.push({ labelKey: realAction, view: null, action: realAction, icon: this.getActionIcon(realAction) });
                    }
                    continue;
                }

                if (this.view.actions[action].enableMenuLink == true) {
                    links.push({ labelKey: action == "add" ? "new" : action, view: this.view.actions[action].view, action: action, icon: this.getActionIcon(action) });
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
                case "save":
                    return 'mdi-content-save';
                case "edit":
                    return 'mdi-pencil';
                case "info":
                    return 'mdi-information-variant';
                default:
                    return "";
            }
        },
    }
};
</script>
