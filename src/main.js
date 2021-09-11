import "./common/StringExtension";
import Vue from "vue";
import store from "./store";
// @ts-ignore
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./assets/styles/index.scss";
import "./plugins/componentRegister";
import "./plugins/appLogger";
import "./plugins/typedStore";

import translate from "./plugins/filters/translate";
Vue.filter(translate.name, translate.filter);

Vue.config.productionTip = false;

new Vue({
    vuetify,
    store,
    render: (h) => h(App),
}).$mount("#app");
