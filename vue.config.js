const path = require("path");

module.exports = {
	// transpileDependencies: ["vuetify"],
	// chainWebpack: (config) => {
	// 	config.module
	// 		.rule("vue")
	// 		.use("vue-loader")
	// 		.loader("vue-loader")
	// 		.tap((options) => {
	// 			// modify the options...
	// 			return options;
	// 		});
	// },
	configureWebpack: {
		devtool: "source-map",
		resolve: {
			alias: {
				src: path.resolve(__dirname, "src"),
			},
		},
	},
};
