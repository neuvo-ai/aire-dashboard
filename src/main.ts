import Vue from "vue";
import App from "./App.vue";
import { decode, JwtPayload } from "jsonwebtoken";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./plugins/view-design.js";

// import Chartkick from "vue-chartkick";
// import Chart from "chart.js";

import axios from "axios";
import i18n from "./i18n";

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_DASHBOARD_API;
axios.defaults.headers.post["Content-Type"] = "application/json";

// @ts-ignore
if (typeof String.prototype.capitalize !== "object") {
	// @ts-ignore
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
}

/*
Chartkick.options = {
	library: {
		animation: { easing: "easeOutQuad" }
	}
};
*/

router.beforeEach(async (to: any, from: any, next) => {
	console.log("beforeEach", to, from);
	if (to.name !== "Login" && to.name !== "Bot List") {
		console.log("Not in login");
		const refreshToken = window.localStorage.getItem("refreshToken");
		if (refreshToken === null) {
			console.log("refreshToken missing");
			window.localStorage.removeItem("jwt");
			router.replace("login");
		} else {
			const refreshDecoded: any = decode(refreshToken);
			if (Math.floor(Date.now() / 1000) > refreshDecoded.exp) {
				console.log("refreshToken expired");
				window.localStorage.removeItem("jwt");
				window.localStorage.removeItem("refreshToken");
				router.replace("login");
				return;
			} else {
				let jwt: string | null | void = window.localStorage.getItem("jwt");
				let decoded: any | JwtPayload | string;

				if (jwt !== null) {
					console.log("jwt not null");
					decoded = decode(jwt);
				}

				if (decoded === null || typeof decoded === "undefined" || typeof decoded !== "object" || Math.floor(Date.now() / 1000) > decoded.exp) {
					console.log("jwt expired or invalid");
					jwt = await refreshJWT().catch(console.error);
					if (typeof jwt === "string") {
						decoded = decode(jwt);
					}
				}

				if (typeof jwt === "string" && decoded !== null && typeof decoded === "object") {
					axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
					// Note: if browser is left open and no activity has occurred a 401 error happens clearing the $store so the set email was moved here from Login.vue
					store.commit("setEmail", decoded.email);
					to.meta.permissions = decoded.permissions;
				} else {
					console.log("jwt");
					window.localStorage.removeItem("jwt");
					router.replace("login");
				}

				// Hack
				console.log("WE ARE HERE", decoded, to);

				console.log(to.name);
				/*
				// @ts-ignore
				if (to.name === "Information" && !decoded.permissions.includes("admin")) {
					console.log("No access to Information");
					router.replace("login");
					return;
				}
				*/
			}
		}
	}
	next();
});

async function refreshJWT(): Promise<string | void> {
	const jwt = window.localStorage.getItem("refreshToken");
	if (jwt !== null) {
		return await axios
			.post(
				`${process.env.VUE_APP_AUTH_API}/auth/refresh`,
				{},
				{
					headers: {
						Authorization: `Bearer ${jwt}`
					}
				}
			)
			.then(async (res: any) => {
				console.log(res.body, res.data);
				console.log({ res, data: res.data });
				if (res.status === 200 && typeof res.data.jwt === "string") {
					window.localStorage.setItem("jwt", res.data.jwt);
					return res.data.jwt;
				}
			});
	} else {
		return;
	}
}

setInterval(() => {
	refreshJWT();
}, 3500000);

// Vue.use(Chartkick.use(Chart));

new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount("#app");
