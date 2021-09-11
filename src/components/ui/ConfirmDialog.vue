<template>
    <v-row justify="center" v-if="$store.state.app.ui.confirmDialog">
        <v-dialog :value="$store.state.app.ui.confirmDialog.show" persistent max-width="600px">
            <v-card :loading="$store.state.app.ui.confirmDialog.show">
                <template slot="progress">
                    <v-progress-linear :color="$store.state.app.ui.confirmDialog.iconColor" height="5" indeterminate></v-progress-linear>
                </template>

                <v-list-item two-line>
                    <v-list-item-avatar>
                        <v-icon :class="[$store.state.app.ui.confirmDialog.iconColor]" dark>{{ $store.state.app.ui.confirmDialog.icon }}</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            {{ $store.state.app.ui.confirmDialog.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $store.state.app.ui.confirmDialog.subTitle }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-card-text class="text--primary body-1">
                    <br />
                    {{ $store.state.app.ui.confirmDialog.message }}
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="showButton('otherButton')" color="info" text @click="onOtherButtonClick">
                        {{ $store.state.app.ui.confirmDialog.otherButtonText }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="showButton('noButton')" color="error" text @click="onNoButtonClick">
                        {{ $store.state.app.ui.confirmDialog.noButtonText }}
                    </v-btn>
                    <v-btn color="success" text @click="onYesButtonClick">{{ $store.state.app.ui.confirmDialog.yesButtonText }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import $ from "../../store/types";

export default {
    name: "h-confirm-dialog",
    methods: {
        onYesButtonClick() {
            this.$store.state.app.ui.confirmDialog.yesButtonCallback();
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
        },
        onNoButtonClick() {
            this.$store.state.app.ui.confirmDialog.noButtonCallback();
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
        },
        onOtherButtonClick() {
            this.$store.state.app.ui.confirmDialog.otherButtonCallback();
            this.$store.commit($.mutations.APP_HIDE_CONFIRMDIALOG);
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
