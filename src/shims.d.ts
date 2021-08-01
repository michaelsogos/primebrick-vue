import { AppLogger } from "./plugins/appLogger";
import { AppLogSeverity } from "./enums/AppLogSeverity";

declare global {
    interface Window {
        logger: typeof AppLogger;
    }
}
