import { AppLog } from "../models/AppLog";
import store from "../store";
import $ from "../store/types";
import { AppLogSeverity } from "../enums/AppLogSeverity";

export class AppLogger {
    /**
     * @param {String} message
     */
    static async debug(message) {
        console.log(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.DEBUG, message));
    }

    /**
     * @param {String} message
     */
    static async info(message) {
        console.info(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.INFO, message));
    }

    /**
     * @param {String} message
     */
    static async warn(message) {
        console.warn(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.WARNING, message));
    }

    /**
     * @param {String | Error} error
     */
    static async error(error) {
        console.error(error);
        const message = typeof error == "string" ? error : error.message;
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.ERROR, message));
    }
}

window.logger = AppLogger;
