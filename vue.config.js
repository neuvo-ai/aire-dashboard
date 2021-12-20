process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
	css: {
		requireModuleExtension: false,
		loaderOptions: {
			less: {
				sourceMap: true,
				javascriptEnabled: true
			}
		}
	},

	pwa: {
		workboxPluginMode: "InjectManifest",
		workboxOptions: {
			swSrc: "./src/sw.js",
			swDest: "service-worker.js"
		},
		themeColor: "#25638A",
		msTileColor: "#25638A",
		iconPaths: {
			msTileImage: "img/icons/mstile-150x150.png"
		}
	},

	chainWebpack: config => {
		config.module
			.rule("view-design")
			.test(/view-design.src.*?js$/)
			.use("babel")
			.loader("babel-loader")
			.end();
		return config;
	},

	devServer: {
		disableHostCheck: true
	},

	pluginOptions: {
		i18n: {
			locale: "en",
			fallbackLocale: "en",
			localeDir: "locales",
			enableInSFC: false
		}
	}
};
