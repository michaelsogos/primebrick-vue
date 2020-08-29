import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";
import { en, it, fr, de } from "vuetify/es5/locale";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: colors.blueGrey.darken4,
				secondary: colors.blueGrey.lighten1,
				accent: colors.blueGrey.lighten2,
				error: colors.red,
				warning: colors.orange,
				info: colors.blue,
				success: colors.green,
				tertiary: colors.pink,
			},
		},
		options: {
			customProperties: true,
		},
	},
	lang: {
		locales: { en, it, fr, de },
		current: "en",
	},
});
