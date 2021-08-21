import Vue from "vue";

//* Register Pages *//
//------------------//
import PageLogin from "../components/Login.vue";
Vue.component(PageLogin.name, PageLogin);

import PageMain from "../components/Main.vue";
Vue.component(PageMain.name, PageMain);

//* Register UI Components *//
//--------------------------//
import UINavTree from "../components/ui/NavTree.vue";
Vue.component(UINavTree.name, UINavTree);

import UIPanel from "../components/ui/Panel.vue";
Vue.component(UIPanel.name, UIPanel);

import UIViewToolbar from "../components/ui/ViewToolbar.vue";
Vue.component(UIViewToolbar.name, UIViewToolbar);

import UIConfirmDialog from "../components/ui/ConfirmDialog.vue";
Vue.component(UIConfirmDialog.name, UIConfirmDialog);

import UIViewLog from "../components/ui/ViewLog.vue";
Vue.component(UIViewLog.name, UIViewLog);

import UIAppBanner from "../components/ui/AppBanner.vue";
Vue.component(UIAppBanner.name, UIAppBanner);

//* Register Views *//
//--------------------------//
import ViewCards from "../components/views/ViewCards.vue";
Vue.component(ViewCards.name, ViewCards);

import ViewGrid from "../components/views/ViewGrid.vue";
Vue.component(ViewGrid.name, ViewGrid);

import ViewForm from "../components/views/ViewForm.vue";
Vue.component(ViewForm.name, ViewForm);
