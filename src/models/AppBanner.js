import { AppLogSeverity } from "../enums/AppLogSeverity";

export class AppBanner {
    constructor(message, title, severity) {
        this.show = false;
        this.title = title;
        this.message = message;

        switch (severity) {
            case AppLogSeverity.DEBUG:
                this.color = "teal";
                this.icon = "mdi-bug";
                break;
            case AppLogSeverity.INFO:
                this.color = "info";
                this.icon = "mdi-information";
                break;
            case AppLogSeverity.WARNING:
                this.color = "warning";
                this.icon = "mdi-alert";
                break;
            case AppLogSeverity.ERROR:
                this.color = "error";
                this.icon = "mdi-close-circle";
                break;
            default:
                this.color = "primary";
                this.icon = "mdi-account-circle";
                break;
        }
    }
}
