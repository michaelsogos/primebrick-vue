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
import { ViewContext } from "../models/ViewContext";
// eslint-disable-next-line no-unused-vars
import { DrawerItem } from "../models/DrawerItem";
// eslint-disable-next-line no-unused-vars
import { AuthTokensPayload } from "../models/AuthTokensPayload";
import { AuthUserProfile } from "../models/AuthUserProfile";
import { StringUtils } from "../common/StringUtils";
import { Translation } from "../models/Translation";

Vue.use(Vuex);

const initialState = {
	app: {
		isReady: false,
		drawerItems: [],
		/** @type {ViewContext[]} */
		viewTabs: [],
		viewTabIndex: null,
		page: "page-login",
		isAuthenticated: false,
		info: {
			author: null,
			copyright: null,
			description: null,
			version: null,
			supportURL: null,
		},
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
		 * @param {Object} info
		 */
		[$.mutations.APP_SET_INFO](state, info) {
			// state.app.info.author = info["application.author"];
			// state.app.info.copyright = info["application.copyright"];
			// state.app.info.description = info["application.description"];
			// state.app.info.help = info["application.help"];
			// state.app.info.home = info["application.home"];
			// state.app.info.mode = info["application.mode"];
			// state.app.info.name = info["application.name"];
			// state.app.info.sdk = info["application.sdk"];
			// state.app.info.themes.splice(0, ...info["application.themes"]);
			// state.app.info.version = info["application.version"];
			// state.app.user.action = info["user.action"];
			// state.app.user.group = info["user.group"];
			// state.app.user.id = info["user.id"];
			// state.app.user.image = info["user.image"];
			// state.app.user.lang = info["user.lang"];
			// state.app.user.login = info["user.login"];
			// state.app.user.name = info["user.name"];
			// state.app.user.navigator = info["user.navigator"];
			// state.app.user.noHelp = info["user.noHelp"];
			// state.app.user.singleTab = info["user.singleTab"];
			// state.app.user.technical = info["user.technical"];
			// state.app.config.viewMaxTabs = info["view.tabs.max"];
			// state.app.config.fileUploadMaxSize = info["file.upload.size"];
			state.app.info = info;
		},
		/**
		 *
		 * @param {initialState} state
		 * @param {MenuItem[]} menuItems
		 */
		[$.mutations.APP_SET_DRAWERITEMS](state, menuItems) {
			//	let drawerItems = UserInterfaceService.TransformMenuItemsToDrawerItems(menuItems);
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
		 * @param {AuthUserProfile} userProfile
		 */
		[$.mutations.APP_SET_USERPROFILE](state, userProfile) {
			state.app.user = userProfile;
		},
		/**
		 *
		 * @param {initialState} state
		 * @param {ViewContext} viewContext
		 */
		[$.mutations.APP_ADD_VIEWTAB](state, viewContext) {
			let index = state.app.viewTabs.push(viewContext);
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
	},
	actions: {
		/**
		 *
		 * @param {ActionContext<initialState>} context
		 */
		async [$.actions.APP_EXEC_INIT](context) {
			try {
				let metaTranslations = await RestApiService.get($api.GET_META_TRANSLATIONS, null, true);
				context.commit($.mutations.APP_SET_TRANSLATIONS, metaTranslations.response);
			} catch (/** @type {Error}*/ ex) {
				console.error(ex);
				alert(ex.message);
			}
		},
		/**
		 *
		 * @param {ActionContext<initialState>} context
		 */
		async [$.actions.APP_EXEC_OPTIN](context) {
			try {
				let metaInfo = await RestApiService.get($api.GET_META_INFO, null, true);
				context.commit($.mutations.APP_SET_INFO, metaInfo.response);

				let metaMenu = await RestApiService.get($api.GET_META_MENU, null, true);
				context.commit($.mutations.APP_SET_DRAWERITEMS, metaMenu.response);
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
				sessionStorage.setItem("authTokens", JSON.stringify(authTokens));
				let decodedProfile = window.atob(authTokens.access_token.split(".")[1]);
				/** @type {AuthUserProfile} */
				let userProfile = JSON.parse(decodedProfile); //TODO: @mso -> to save in store
				console.log(userProfile);

				context.commit($.mutations.APP_SET_AUTHENTICATION, true);
				context.commit($.mutations.APP_SET_USERPROFILE, userProfile);
				context.commit($.mutations.APP_SET_PAGE, "page-main");
			} else {
				console.error(result.exception);
				alert(result.clientMessage);
			}
		},
		/**
		 *
		 * @param {ActionContext<initialState>} context
		 * @param {DrawerItem} drawerItem
		 */
		async [$.actions.APP_OPEN_LINK](context, drawerItem) {
			let result = await RestApiService.post(`${$api.POST_ACTION}${drawerItem.action}`, {
				model: "com.axelor.meta.db.MetaAction",
			});

			if (!result.hasError) {
				/** @type {ViewContext} */
				let viewContext = result.response.data[0].view;
				if (!viewContext.icon) viewContext.icon = drawerItem.baseIcon;
				viewContext.color = drawerItem.baseColor;
				context.commit($.mutations.APP_ADD_VIEWTAB, viewContext);
			} else {
				console.error(result.exception);
				alert(result.clientMessage);
			}
		},
		/**
		 *
		 * @param {ActionContext<initialState>} context
		 * @param {ViewContext} viewContext
		 */
		async [$.actions.APP_OPEN_VIEW](context, viewContext) {
			context.commit($.mutations.APP_ADD_VIEWTAB, viewContext);
		},
		/**
		 *
		 * @param {ActionContext<initialState>} context
		 */
		async [$.actions.APP_LOGOUT_USER](context) {
			sessionStorage.removeItem("authTokens");

			context.commit($.mutations.APP_SET_AUTHENTICATION, false);
			context.commit($.mutations.APP_SET_USERPROFILE, new AuthUserProfile());
			context.commit($.mutations.APP_SET_PAGE, "page-login");
		},
	},
	getters: {
		[$.getters.APP_GET_VIEWDEFINITION]: (state) => async (context, view, model) => {
			let result = await RestApiService.post($api.POST_VIEW, {
				data: {
					context: context,
					name: view.name,
					type: view.type,
				},
				model: model,
			});

			if (!result.hasError) {
				return result.response.data;
			} else {
				console.error(result.exception);
				alert(result.clientMessage);
			}
		},
		[$.getters.APP_GET_RECORDS]: (state) => async (context, domainFilter, model, fields, limit, offset, sortBy) => {
			let _domainContext = context;
			_domainContext._model = model;

			let result = await RestApiService.post(`${$api.POST_REST}${model}/search`, {
				data: {
					criteria: [], //TODO: @mso -> add support for custom search
					operator: "and", //TODO: @mso -> add support for custom search
					_domain: domainFilter,
					_domainContext: _domainContext,
				},
				fields: fields,
				limit: limit,
				offset: offset,
				sortBy: sortBy,
			});

			if (!result.hasError) {
				return result.response;
			} else {
				console.error(result.exception);
				alert(result.clientMessage);
			}
		},
		[$.getters.APP_GET_RECORD]: (state) => async (model, fields, recordId) => {
			let result = await RestApiService.post(`${$api.POST_REST}${model}/${recordId}/fetch`, {
				fields: fields,
				related: {},
			});

			if (!result.hasError) {
				return result.response;
			} else {
				console.error(result.exception);
				alert(result.clientMessage);
			}
		},
		[$.getters.APP_GET_TRANSLATION]: (state) => (key) => {
			let translation = state.translations.find((item) => {
				return item.key === key;
			});

			if (translation) return translation;
			else return new Translation(key, `{{${key}_MISSING}}`, false);
		},
		[$.getters.APP_TRANSLATE_STRING]: (state) => (key, params) => {
			if (StringUtils.isNullOrWhitespace(key)) return "{{WRONG_KEY}}";
			else {
				let translation = store.getters[$.getters.APP_GET_TRANSLATION](key);
				let is_template = translation.is_template;
				var str = translation.value;
				if (is_template == false) {
					return str;
				} else {
					if (!Array.isArray(params)) {
						params = [params];
					}
					if (params && params.length) {
						var result = str;
						var splittedString = str.split(" "); //TODO: @mso -> Revise this code, we should use REGEX MATCH and REPLACE to look for any placeholder (consider that a translation can have attached letter so space is not enought)
						var keyArray = [];
						params.forEach(function(o) {
							Object.getOwnPropertyNames(o).forEach(function(k) {
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
