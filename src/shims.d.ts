import { AppLogger } from "./plugins/appLogger";
import { AppLogSeverity } from "./enums/AppLogSeverity";
import { Store } from "vuex";
import { AppInfo } from "./models/AppInfo";
import { AuthUserProfile } from "./models/AuthUserProfile";
import { MenuItem } from "./models/MenuItem";
import { View } from "./models/View";
import { Translation } from "./models/Translation";
import { ConfirmDialog } from "./models/ConfirmDialog";
import { AppBanner } from "./models/AppBanner";
import { AppLog } from "./models/AppLog";
import Vue from "vue";

declare global {
    interface Window {
        logger: typeof AppLogger;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $$store: Store<StoreState>;
        $$refs: {
            form: any;
        };
    }
}

declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

interface StoreState {
    app: {
        isReady: boolean;
        drawerItems: MenuItem[];
        viewTabs: View[];
        viewTabIndex: number;
        page: number;
        isAuthenticated: boolean;
        info: AppInfo;
        user: AuthUserProfile;
        config: {
            fileUploadMaxSize: number;
            viewMaxTabs: number;
        };
        translations: Translation[];
        ui: {
            confirmDialog: ConfirmDialog;
            banner: AppBanner;
        };
        logs: AppLog[];
    };
}

declare global {
    interface String {
        interpolate(params: Object): String;
    }
}
