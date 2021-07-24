/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "[context,state]" }]*/

import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import Vuex, { ActionContext } from "vuex";
import $ from "./types";
import { RestApiService } from "../services/RestApiService";
import $api from "../enums/ApiEndPoints";
// eslint-disable-next-line no-unused-vars
import { MenuItem } from "../models/MenuItem";
// eslint-disable-next-line no-unused-vars
import { AuthTokensPayload } from "../models/AuthTokensPayload";
import { AuthUserProfile } from "../models/AuthUserProfile";
import { StringUtils } from "../common/StringUtils";
import { Translation } from "../models/Translation";
import { AppInfo } from "../models/AppInfo";
// eslint-disable-next-line no-unused-vars
import { View } from "../models/View";
// eslint-disable-next-line no-unused-vars
import { Query } from "../models/Query";
import Vuetify from "../plugins/vuetify";
// eslint-disable-next-line no-unused-vars
import { QueryResult } from "../models/QueryResult";
// eslint-disable-next-line no-unused-vars
import { OpenView } from "../models/OpenView";
// eslint-disable-next-line no-unused-vars
import { SaveEntity } from "../models/SaveEntity";

Vue.use(Vuex);

const initialState = {
    app: {
        isReady: false,
        drawerItems: [],
        /** @type {View[]} */
        viewTabs: [],
        viewTabIndex: null,
        page: null,
        isAuthenticated: false,
        info: new AppInfo(),
        user: new AuthUserProfile(),
        config: {
            fileUploadMaxSize: null,
            viewMaxTabs: null,
        },
        /** @type {Translation[]} */
        translations: [],
    },
};

const store = new Vuex.Store({
    state: initialState,
    modules: {},
    mutations: {
        /**
         *
         * @param {initialState} state
         * @param {AppInfo} info
         */
        [$.mutations.APP_SET_INFO](state, info) {
            state.app.info = info;
        },
        /**
         *
         * @param {initialState} state
         * @param {MenuItem[]} menuItems
         */
        [$.mutations.APP_SET_DRAWERITEMS](state, menuItems) {
            state.app.drawerItems.splice(0);
            state.app.drawerItems.push(...menuItems);
        },
        /**
         *
         * @param {initialState} state
         * @param {String} pageName
         */
        [$.mutations.APP_SET_PAGE](state, pageName) {
            state.app.page = pageName;
        },
        /**
         *
         * @param {initialState} state
         * @param {Boolean} isAuthenticated
         */
        [$.mutations.APP_SET_AUTHENTICATION](state, isAuthenticated) {
            state.app.isAuthenticated = isAuthenticated;
        },
        /**
         *
         * @param {initialState} state
         * @param {AuthTokensPayload} authTokens
         */
        [$.mutations.APP_SET_AUTHTOKEN](state, authTokens) {
            if (authTokens) {
                sessionStorage.setItem("authTokens", JSON.stringify(authTokens));
                let decodedProfile = window.atob(authTokens.access_token.split(".")[1]);
                /** @type {AuthUserProfile} */
                let userProfile = JSON.parse(decodedProfile);
                state.app.user = userProfile;
            } else {
                sessionStorage.removeItem("authTokens");
                state.app.user = new AuthUserProfile();
            }
        },
        /**
         *
         * @param {initialState} state
         * @param {View} view
         */
        [$.mutations.APP_ADD_VIEWTAB](state, view) {
            let index = state.app.viewTabs.push(view);
            state.app.viewTabIndex = index - 1;
        },
        /**
         *
         * @param {initialState} state
         * @param {Number} tabIndex
         */
        [$.mutations.APP_REMOVE_VIEWTAB](state, tabIndex) {
            state.app.viewTabs.splice(tabIndex, 1);
        },
        /**
         *
         * @param {initialState} state
         * @param {Translation[]} translations
         */
        [$.mutations.APP_SET_TRANSLATIONS](state, translations) {
            state.app.translations.splice(0, state.app.translations.length, ...translations);
        },
        /**
         *
         * @param {initialState} state
         * @param {Translation[]} translations
         */
        [$.mutations.APP_ADD_TRANSLATIONS](state, translations) {
            state.app.translations.push(...translations);
        },
    },
    actions: {
        /**
         *
         * @param {ActionContext<initialState>} context
         */
        async [$.actions.APP_EXEC_INIT](context) {
            try {
                let metaTranslations = await RestApiService.get(
                    $api.GET_META_TRANSLATIONS,
                    {
                        group: "login",
                    },
                    true
                );

                context.commit($.mutations.APP_SET_TRANSLATIONS, metaTranslations.response);

                const authTokens = JSON.parse(sessionStorage.getItem("authTokens"));
                if (authTokens) {
                    context.commit($.mutations.APP_SET_AUTHTOKEN, authTokens);
                    context.commit($.mutations.APP_SET_AUTHENTICATION, true);
                } else {
                    context.commit($.mutations.APP_SET_AUTHTOKEN, null);
                    context.commit($.mutations.APP_SET_AUTHENTICATION, false);
                }
            } catch (/** @type {Error}*/ ex) {
                console.error(ex);
                alert(ex.clientMessage || ex.message);
            }
        },
        /**
         *
         * @param {ActionContext<initialState>} context
         */
        async [$.actions.APP_EXEC_OPTIN](context) {
            try {
                let metaTranslations = await RestApiService.get(
                    $api.GET_META_TRANSLATIONS,
                    {
                        group: "core",
                    },
                    true
                );
                context.commit($.mutations.APP_ADD_TRANSLATIONS, metaTranslations.response);

                let metaInfo = await RestApiService.get($api.GET_META_INFO, null, true);
                context.commit($.mutations.APP_SET_INFO, metaInfo.response);

                let metaMenu = await RestApiService.get($api.GET_META_MENU, null, true);
                context.commit($.mutations.APP_SET_DRAWERITEMS, metaMenu.response);

                Vuetify.framework.lang.current = context.state.app.user ? context.state.app.user.languageCode : "en";
            } catch (/** @type {Error}*/ ex) {
                console.error(ex);
                alert(ex.message);
            }
        },
        /**
         *
         * @param {ActionContext<initialState>} context
         * @param {{username:String,password:String}} credentials
         */
        async [$.actions.APP_LOGIN_USER](context, credentials) {
            let result = await RestApiService.post($api.POST_USER_LOGIN, credentials);

            if (!result.hasError) {
                /** @type {AuthTokensPayload} */
                const authTokens = result.response;

                context.commit($.mutations.APP_SET_AUTHTOKEN, authTokens);
                context.commit($.mutations.APP_SET_AUTHENTICATION, true);
                context.commit($.mutations.APP_SET_PAGE, "page-main");
            } else {
                console.error(result.exception);
                return false;
            }
        },
        /**
         *
         * @param {ActionContext<initialState>} context
         * @param {OpenView} openView
         */
        async [$.actions.APP_OPEN_VIEW](context, openView) {
            let result = await RestApiService.get($api.GET_META_VIEW, {
                viewName: openView.viewName,
            });

            if (!result.hasError) {
                /** @type {View} */
                let view = result.response;
                view.entityId = openView.entityId;
                view.readonly = openView.readonly;
                if (!view.icon) view.icon = openView.icon;
                if (!view.color) view.color = openView.color;
                context.commit($.mutations.APP_ADD_VIEWTAB, view);
            } else {
                console.error(result.exception);
                alert(result.clientMessage); //TODO: @michaelsogos -> show error page
            }
        },
        /**
         *
         * @param {ActionContext<initialState>} context
         */
        async [$.actions.APP_LOGOUT_USER](context) {
            context.commit($.mutations.APP_SET_AUTHTOKEN, null);
            context.commit($.mutations.APP_SET_AUTHENTICATION, false);
            context.commit($.mutations.APP_SET_PAGE, "page-login");
        },
        /**
         *
         * @param {ActionContext<initialState>} context
         * @param {SaveEntity} saveEntity
         */
        async [$.actions.APP_SAVE_ENTITY](context, saveEntity) {
            let result = await RestApiService.post($api.POST_SAVE_ENTITY, saveEntity);

            if (!result.hasError) {
                console.log(result.response.data[0]);
                return result.response.data.length == 1 ? result.response.data[0] : null;
            } else {
                console.error(result.exception);
                alert(result.clientMessage);
            }
        },
    },
    getters: {
        [$.getters.APP_GET_RECORDS]:
            (state) =>
            /**
             *
             * @param {Query} query
             * @returns {QueryResult}
             */
            async (query) => {
                let result = await RestApiService.post($api.POST_GET_DATA, query);

                if (!result.hasError) {
                    return result.response;
                } else {
                    console.error(result.exception);
                    alert(result.clientMessage);
                }
            },
        [$.getters.APP_GET_RECORD]:
            (state) =>
            /**
             *
             * @param {Query} query
             * @returns {Object}
             */
            async (query) => {
                let result = await RestApiService.post($api.POST_GET_ENTITY, query);

                if (!result.hasError) {
                    return result.response.data.length == 1 ? result.response.data[0] : null;
                } else {
                    console.error(result.exception);
                    alert(result.clientMessage);
                }
            },
        [$.getters.APP_GET_RECORDINFO]:
            (state) =>
            /**
             *
             * @param {Query} query
             * @returns {Object}
             */
            async (query) => {
                let result = await RestApiService.post($api.POST_GET_RECORDINFO, query);

                if (!result.hasError) {
                    return result.response.data.length == 1 ? result.response.data[0] : null;
                } else {
                    console.error(result.exception);
                    alert(result.clientMessage);
                }
            },
        [$.getters.APP_GET_TRANSLATION]: (state) => (key) => {
            let translation = state.app.translations.find((item) => {
                return item.key === key;
            });

            if (translation) return translation;
            else return new Translation(key, `{{${key}_MISSING}}`, false);
        },
        [$.getters.APP_TRANSLATE_STRING]: (state) => (key, params) => {
            if (StringUtils.isNullOrWhitespace(key)) return "{{WRONG_KEY}}";
            else {
                /** @type {Translation} */
                let translation = store.getters[$.getters.APP_GET_TRANSLATION](key);
                var str = translation.value;
                if (translation.isTemplate == false) {
                    return str;
                } else {
                    if (!Array.isArray(params)) {
                        params = [params];
                    }
                    if (params && params.length) {
                        var result = str;
                        var splittedString = str.split(" "); //TODO: @mso -> Revise this code, we should use REGEX MATCH and REPLACE to look for any placeholder (consider that a translation can have attached letter so space is not enought)
                        var keyArray = [];
                        params.forEach(function (o) {
                            Object.getOwnPropertyNames(o).forEach(function (k) {
                                keyArray.push(k);
                            });
                        });
                        splittedString.forEach((string) => {
                            if (string.includes("${")) {
                                var substr = string.substring(2, string.length - 1);
                                if (keyArray.includes(substr)) {
                                    let currentObj = params.find((k) => Object.getOwnPropertyNames(k) == substr);
                                    result = result.replace(string, currentObj[substr]);
                                }
                            }
                        });

                        return result;
                    } else return str;
                }
            }
        },
    },
});

export default store;
