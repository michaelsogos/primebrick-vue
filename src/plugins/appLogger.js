import { AppLog } from "../models/AppLog";
import store from "../store";
import $ from "../store/types";
import { AppLogSeverity } from "../enums/AppLogSeverity";

export class AppLogger {
    static async debug(message) {
        console.log(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.DEBUG, message));
    }

    static async info(message) {
        console.info(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.INFO, message));
    }

    static async warn(message) {
        console.warn(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.WARNING, message));
    }

    static async error(message) {
        console.error(message);
        store.commit($.mutations.APP_ADD_LOGENTRY, new AppLog(AppLogSeverity.ERROR, message));
    }
}

window.logger = AppLogger;
