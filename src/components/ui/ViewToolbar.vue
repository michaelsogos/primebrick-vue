<template >
    <v-toolbar
        dense
        flat
        tile
        :color="`${computeColor(view.color)} lighten-5`"
        height="46"
        :style="`border-bottom: 2px solid ${computeCssColor(view.color)} !important`"
    >
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.ADD)" @click="onAddItem">
            <v-icon left>mdi-plus</v-icon>
            {{ "new" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.SAVE)" @click="$emit(ViewAction.SAVE)">
            <v-icon left>mdi-content-save</v-icon>
            {{ ViewAction.SAVE | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.EDIT)" @click="$emit(ViewAction.EDIT)">
            <v-icon left>mdi-pencil</v-icon>
            {{ ViewAction.EDIT | translate }}
        </v-btn>
        <v-btn text tile class="caption error--text" v-if="checkToolbarButtonVisibility(ViewAction.DELETE)" @click="$emit(ViewAction.DELETE)">
            <v-icon left>mdi-delete-alert</v-icon>
            {{ ViewAction.DELETE | translate }}
        </v-btn>
        <v-btn text tile class="caption error--text" v-if="checkToolbarButtonVisibility(ViewAction.ARCHIVE)" @click="$emit(ViewAction.ARCHIVE)">
            <v-icon left>mdi-trash-can</v-icon>
            {{ ViewAction.ARCHIVE | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.RESTORE)" @click="$emit(ViewAction.RESTORE)">
            <v-icon left>mdi-restore</v-icon>
            {{ ViewAction.RESTORE | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.REFRESH)" @click="$emit(ViewAction.REFRESH)">
            <v-icon left>mdi-refresh</v-icon>
            {{ ViewAction.REFRESH | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.INFO)" @click="$emit(ViewAction.INFO)">
            <v-icon left>mdi-information-variant</v-icon>
            {{ "information" | translate }}
        </v-btn>
        <v-btn text tile class="caption primary--text" v-if="checkToolbarButtonVisibility(ViewAction.FILTER)" @click="$emit(ViewAction.FILTER)">
            <v-icon left>mdi-filter</v-icon>
            {{ "filters" | translate }}
        </v-btn>
        <v-chip small color="info" v-if="appliedFilters">
            {{ "applied-filters-text" | translate({ count: appliedFilters }) }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-select
            v-if="checkToolbarButtonVisibility(ViewAction.ARCHIVED_FILTER)"
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
            v-if="checkToolbarButtonVisibility(ViewAction.SEARCH)"
        >
            <template v-slot:prepend-inner>
                <v-icon size="18">mdi-magnify</v-icon>
            </template>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-btn-toggle v-if="alternativeViews.length > 0" :value="0" group :color="computeColor(view.color)" class="pa-0 ma-0">
            <v-btn :title="$options.filters.translate(`view-type-${view.type}`)" class="ma-0 pa-0">
                <v-icon>{{ getViewIcon(view.type) }}</v-icon>
            </v-btn>
            <template v-for="item in alternativeViews">
                <v-btn
                    :key="item.type"
                    :title="$options.filters.translate(`view-type-${item.type}`)"
                    class="ma-0 pa-0"
                    @click.stop="onChangeView(item.name)"
                >
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
import { ViewAction } from "../../enums/ViewAction";

export default {
    name: "h-view-toolbar",
    props: {
        view: View,
        appliedFilters: Number
    },
    data: function () {
        return {
            /** @type {String} */
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
            showArchivedSelectedOption: this.view.definition.showArchivedEntities || 'none',
            ViewAction,
            /** @type {import("../../models/View").ViewNameType[]} */
            alternativeViews: []
        };
    },
    methods: {
        onAddItem() {
            this.$store.dispatch($.actions.APP_OPEN_VIEW, OpenView.fromView(this.view, this.view.definition.actions.add.view, null));
        },
        onOpenLink(/** @type {{ labelKey: String, view: String, action: String, icon: String }} */link) {
            switch (link.action) {
                case ViewAction.ADD:
                    this.onAddItem();
                    break;
                default:
                    this.$emit(link.action);
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
            const isVisible = this.view?.definition?.actions ? this.view?.definition?.actions[actionName]?.enableToolbarButton : false;

            switch (actionName) {
                case ViewAction.SAVE:
                    return !this.view.readonly && isVisible;
                case ViewAction.EDIT: {
                    const isSaveEnable = this.view?.definition?.actions?.save?.enableToolbarButton || false;
                    return this.view.readonly && isSaveEnable;
                }
                case ViewAction.DELETE:
                case ViewAction.ARCHIVE: {
                    return isVisible && this.view.definition.showArchivedEntities != 'only';
                }
                case ViewAction.RESTORE: {
                    return isVisible && this.view.definition.showArchivedEntities != 'none';
                }
                case ViewAction.FILTER: {
                    return this.view?.definition?.actions?.filter?.enableDialog || false;
                }
                default:
                    return isVisible;
            }
        },
        /** @returns {String} */
        getViewIcon(/** @type {String} */ viewType) {
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
            for (const action in this.view.definition.actions) {
                if (this.view.definition.actions[action].enableMenuLink == true) {
                    showMenu = true;
                    break;
                }
            }

            return showMenu;
        },
        /** @returns {{ labelKey: String, view: String, action: String, icon: String }[]} */
        getMenuLink() {
            const links = [];
            for (const action in this.view.definition.actions) {
                let realAction = action;
                let labelKey = action;
                let view = this.view.definition.actions[action].view;

                if (this.view.definition.actions[action].enableMenuLink == true) {
                    switch (action) {
                        case ViewAction.SAVE:
                            if (this.view.readonly) {
                                realAction = ViewAction.EDIT;
                                labelKey = ViewAction.EDIT;
                                view = null;
                            }
                            break;
                        case ViewAction.ADD:
                            labelKey = 'new';
                            break;
                        case ViewAction.EDIT:
                            if (!this.view.definition.actions.save || !this.view.definition.actions.save.enableMenuLink) continue;
                            break;
                        case ViewAction.DELETE:
                        case ViewAction.ARCHIVE: if (this.view.definition.showArchivedEntities == 'only') continue;
                            break;
                        case ViewAction.RESTORE:
                            if (this.view.definition.showArchivedEntities == 'none') continue;
                            break;
                    }

                    links.push({ labelKey, view, action: realAction, icon: this.getActionIcon(realAction) });
                }
            }
            return links;
        },
        /** @returns {String} */
        getActionIcon(/** @type {String} */ actionName) {
            switch (actionName) {
                case ViewAction.ADD:
                    return 'mdi-plus';
                case ViewAction.DELETE:
                    return 'mdi-delete-alert';
                case ViewAction.ARCHIVE:
                    return 'mdi-trash-can';
                case ViewAction.RESTORE:
                    return 'mdi-restore';
                case ViewAction.REFRESH:
                    return 'mdi-refresh';
                case ViewAction.SAVE:
                    return 'mdi-content-save';
                case ViewAction.EDIT:
                    return 'mdi-pencil';
                case ViewAction.INFO:
                    return 'mdi-information-variant';
                default:
                    return "";
            }
        },
        onChangeView(/** @type {String} */ viewName) {
            this.$store.dispatch($.actions.APP_CHANGE_VIEW, viewName);

        }
    },
    mounted() {
        this.alternativeViews = this.view?.definition?.alternativeViews || [];
    }
};
</script>
