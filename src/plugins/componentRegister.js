import Vue from "vue";

//* Register Pages *//
//------------------//
// @ts-ignore
import PageLogin from "../components/Login.vue";
Vue.component(PageLogin.name, PageLogin);

// @ts-ignore
import PageMain from "../components/Main.vue";
Vue.component(PageMain.name, PageMain);

//* Register UI Components *//
//--------------------------//
// @ts-ignore
import UINavTree from "../components/ui/NavTree.vue";
Vue.component(UINavTree.name, UINavTree);

// @ts-ignore
import UIPanel from "../components/ui/Panel.vue";
Vue.component(UIPanel.name, UIPanel);

// @ts-ignore
import UIViewToolbar from "../components/ui/ViewToolbar.vue";
Vue.component(UIViewToolbar.name, UIViewToolbar);

// @ts-ignore
import UIConfirmDialog from "../components/ui/ConfirmDialog.vue";
Vue.component(UIConfirmDialog.name, UIConfirmDialog);

// @ts-ignore
import UIViewLog from "../components/ui/ViewLog.vue";
Vue.component(UIViewLog.name, UIViewLog);

// @ts-ignore
import UIAppBanner from "../components/ui/AppBanner.vue";
Vue.component(UIAppBanner.name, UIAppBanner);

//* Register Views *//
//--------------------------//
// @ts-ignore
import ViewCards from "../components/views/ViewCards.vue";
Vue.component(ViewCards.name, ViewCards);

// @ts-ignore
import ViewGrid from "../components/views/ViewGrid.vue";
Vue.component(ViewGrid.name, ViewGrid);

// @ts-ignore
import ViewForm from "../components/views/ViewForm.vue";
Vue.component(ViewForm.name, ViewForm);
