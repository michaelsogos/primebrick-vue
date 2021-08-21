<template>
    <transition name="bounce-in-top">
        <v-card
            v-if="$store.state.app.ui.banner && $store.state.app.ui.banner.show"
            rounded
            class="col-6 offset-3 app-banner rounded-b-lg px-1 pb-0"
            elevation="12"
        >
            <v-list-item dense>
                <v-list-item-icon class="mr-2">
                    <v-icon size="32" :color="`${$store.state.app.ui.banner.color} darken-2`">{{ $store.state.app.ui.banner.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="[`${$store.state.app.ui.banner.color}--text text--darken-2`]">
                    {{ $store.state.app.ui.banner.title || $options.filters.translate("application-message") }}
                </v-list-item-title>
            </v-list-item>
            <v-card-text class="py-0">
                <div class="content scroll-overflow">
                    {{ $store.state.app.ui.banner.message || $options.filters.translate("message-not-defined") }}
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="$store.state.app.ui.banner.show = !$store.state.app.ui.banner.show" class="mt-2">
                    {{ "close" | translate }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </transition>
</template>

<script>
import $ from "../../store/types";

export default {
    name: "h-app-banner",
    methods: {
        onYesButtonClick() {
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
            this.$store.state.app.ui.confirmDialog.yesButtonCallback();
        },
        onNoButtonClick() {
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
            this.$store.state.app.ui.confirmDialog.noButtonCallback();
        },
        onOtherButtonClick() {
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
            this.$store.state.app.ui.confirmDialog.otherButtonCallback();
        },
        showButton(buttonName) {
            switch (buttonName) {
                case 'noButton':
                    return !this.$store.state.app.ui.confirmDialog.isAlert;
                case 'otherButton':
                    return !this.$store.state.app.ui.confirmDialog.isAlert && this.$store.state.app.ui.confirmDialog.otherButtonText;
                default:
                    return true;
            }
        }
    }
};
</script>
<style>
.app-banner {
    position: fixed;
    top: -5px;
    z-index: 1000;
}

.app-banner .scroll-overflow {
    overflow: auto;
    max-height: 200px;
}
</style>