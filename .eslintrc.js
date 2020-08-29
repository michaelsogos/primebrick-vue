module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/essential", "eslint:recommended"], //, "@vue/prettier"
	parserOptions: {
		parser: "babel-eslint",
	},
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
		document: true,
		window: true,
		Vue: true,
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/valid-v-slot": "off",
	},
};
