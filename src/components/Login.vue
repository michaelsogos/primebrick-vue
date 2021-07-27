<template>
    <v-container fluid fill-height class="pa-0 ma-0">
        <v-row justify="center" align="center" class="secondary">
            <v-col md="3" sm="6">
                <v-card color="secondary" dark elevation="0">
                    <v-card-title class="text-center">
                        <div class="text-center pt-5 text-h4" style="width: 100%">{{ "login" | translate }}</div>
                    </v-card-title>

                    <v-card-subtitle class="text-center">{{ "login-hint" | translate }}</v-card-subtitle>

                    <v-card-text>
                        <v-form>
                            <v-alert :value="showAlertCapsLock" type="warning" border="left" :colored-border="true" dense  text class="mt-4 warning lighten-4" light icon="mdi-alert" >
                                {{ "caps-lock-warning" | translate }}
                            </v-alert>
                                
                            <v-text-field
                                solo-inverted
                                flat
                                clearable
                                @click.stop
                                @keyup.enter="onLogin"
                                @keydown="checkIfCapsLockIsOn"
                                hide-details
                                v-model="username"
                                prepend-inner-icon="mdi-shield-account"
                                :label="'username' | translate"
                                ref="username"
                                tabindex="1"
                            ></v-text-field>

                            <v-text-field
                                solo-inverted
                                flat
                                clearable
                                hide-details
                                type="password"
                                @click.stop
                                @keyup.enter="onLogin"
                                @keydown="checkIfCapsLockIsOn"
                                prepend-inner-icon="mdi-shield-key"
                                v-model="password"
                                :label="'password' | translate"
                                class="mt-4"
                                ref="password"
                                tabindex="2"
                            ></v-text-field>

                            <v-btn color="tertiary" large block @click.stop="onLogin" elevation="0" class="mt-8" tabindex="3">
                                {{ "login" | translate }}
                            </v-btn>

                            <v-alert
                                type="error"
                                border="left"
                                :colored-border="true"
                                class="mt-4 white"
                                dense
                                elevation="0"
                                light
                                :value="showErrorMessage"
                            >
                                {{ "login-failed" | translate }}
                            </v-alert>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//TODO: @mso -> Add validation rules to view
import $ from "../store/types";

export default {
    name: 'page-login',
    data: () => ({
        username: '',
        password: '',
        showAlertCapsLock: false,
        showErrorMessage: false,
    }),
    methods: {
        onLogin() {
            this.$store.dispatch($.actions.APP_LOGIN_USER, { username: this.username, password: this.password }).then(result => {
                if (!result) this.showErrorMessage = true;
            });
        },
        /**
         * @param {KeyboardEvent} event
         */
        checkIfCapsLockIsOn(event) {
            if (event.getModifierState && event.getModifierState("CapsLock")) {
                this.showAlertCapsLock = true;
            }
            else this.showAlertCapsLock = false;
        },
    },
    mounted() {
    },
    beforeDestroy() {
        this.showAlertCapsLock = false;
    }
}
</script>