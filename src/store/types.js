module.exports = {
	actions: {
		APP_EXEC_INIT: "actionAppExecInit",
		APP_LOGIN_USER: "actionAppLoginUser",
		APP_OPEN_VIEW: "actionAppOpenView",
		APP_LOGOUT_USER: "actionAppLogoutUser",
		APP_EXEC_OPTIN: "actionAppExecOptin",
	},
	getters: {
		APP_GET_RECORDS: "getterAppGetRecords",
		// APP_GET_RECORD: "getterAppGetRecord",
		APP_TRANSLATE_STRING: "getterAppTranslateString",
		APP_GET_TRANSLATION: "getterAppGetTranslation",
	},
	mutations: {
		APP_SET_INFO: "mutationAppSetInfo",
		APP_SET_DRAWERITEMS: "mutationAppSetDrawerItems",
		APP_SET_PAGE: "mutationAppSetPage",
		APP_SET_AUTHENTICATION: "mutationAppSetAuthentication",
		APP_ADD_VIEWTAB: "mutationAppAddViewTab",
		APP_REMOVE_VIEWTAB: "mutationAppRemoveViewTab",
		APP_SET_AUTHTOKEN: "mutationAppSetAuthToken",
		APP_SET_TRANSLATIONS: "mutationAppSetTranslations",
	},
};
