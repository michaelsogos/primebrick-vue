import { AppLog } from "../models/AppLog";
import store from "../store";
import $ from "../store/types";
import { AppLogSeverity } from "../enums/AppLogSeverity";
import { AppBanner } from "../models/AppBanner";

export class AppLogger {
    /**
     * @param {String} message
     * @param {{show:Boolean,title:String}} appBannerOptions
     */
    static async debug(message, appBannerOptions = null) {
        console.log(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.DEBUG, message));

        if (appBannerOptions && appBannerOptions.show) {
            store.commit($.mutations.APP_SHOW_BANNER, new AppBanner(message, appBannerOptions.title, AppLogSeverity.DEBUG));
        }
    }

    /**
     * @param {String} message
     * @param {{show:Boolean,title:String}} appBannerOptions
     */
    static async info(message, appBannerOptions = null) {
        console.info(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.INFO, message));

        if (appBannerOptions && appBannerOptions.show) {
            store.commit($.mutations.APP_SHOW_BANNER, new AppBanner(message, appBannerOptions.title, AppLogSeverity.INFO));
        }
    }

    /**
     * @param {String} message
     * @param {{show:Boolean,title:String}} appBannerOptions
     */
    static async warn(message, appBannerOptions = null) {
        console.warn(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.WARNING, message));

        if (appBannerOptions && appBannerOptions.show) {
            store.commit($.mutations.APP_SHOW_BANNER, new AppBanner(message, appBannerOptions.title, AppLogSeverity.WARNING));
        }
    }

    /**
     * @param {String | Error} error
     * @param {{show:Boolean,title:String}} appBannerOptions
     */
    static async error(error, appBannerOptions = null) {
        console.error(error);
        const message = typeof error == "string" ? error : error.message;
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.ERROR, message));

        if (appBannerOptions && appBannerOptions.show) {
            store.commit($.mutations.APP_SHOW_BANNER, new AppBanner(message, appBannerOptions.title, AppLogSeverity.ERROR));
        }
    }
}

window.logger = AppLogger;
