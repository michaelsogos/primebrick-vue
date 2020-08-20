import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./plugins/componentRegister";

import translate from "./plugins/filters/translate";
Vue.filter(translate.name, translate.filter);

Vue.config.productionTip = false;

new Vue({
	vuetify,
	store,
	render: (h) => h(App),
}).$mount("#app");
