import Vue from "vue";
import VueI18n, { LocaleMessages } from "vue-i18n";
// @ts-ignore
import { locale as iLocale } from "view-design";
import lang_en from "view-design/dist/locale/en-US.js";
import lang_fi from "view-design/dist/locale/fi-FI.js";

Vue.use(VueI18n);

// @ts-ignore
// Vue.locale = () => {
// 	console.log("Vue locale init for view-design");
// };

const currentLanguage = window.localStorage.getItem("language") || navigator.language.replace(/[-_].*/, "") || process.env.VUE_APP_I18N_LOCALE || "en";

function loadLocaleMessages(): LocaleMessages {
	const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
	const messages: LocaleMessages = {};
	locales.keys().forEach(key => {
		const matched = key.match(/([A-Za-z0-9-_]+)\./i);
		if (matched && matched.length > 1) {
			const locale = matched[1];

			// messages[locale] = { ...locales(key), ...uiLocales };
			messages[locale] = locales(key);
		}
	});

	return messages;
}

if (currentLanguage === "fi") {
	iLocale(lang_fi);
} else {
	iLocale(lang_en);
}

const i18n = new VueI18n({
	locale: currentLanguage,
	fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
	formatFallbackMessages: true,
	messages: loadLocaleMessages()
});

// This workaround and the proper way to load translations with i18n + view-design currently fails on modals.

// https://github.com/kazupon/vue-i18n/issues/184
// const i18nPlugin = {
// 	install(Vue: any, options: any) {
// 		const _$t = Vue.prototype.$t
// 		Vue.prototype._$t = _$t
// 		Vue.prototype.$t = function () {
// 			try {
// 				if (this.$i18n) {
// 					return _$t.apply(this, arguments)
// 				} else {
// 					const run = _$t(Vue.$root, arguments)
// 					return run;
// 				}
// 			} catch (e) {
// 				console.warn(e)
// 				return arguments;
// 			}
// 		}
// 	}
// }
// Vue.use(i18nPlugin);

export default i18n;
