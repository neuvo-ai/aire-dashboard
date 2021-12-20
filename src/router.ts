import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Password from "./views/Password.vue";
import Admin from "./views/Admin.vue";
import Audits from "./views/Audits.vue";
import Information from "./views/Home.vue";
import Bots from "./views/Bots.vue";
import Bot from "./views/Bot.vue";
import BotList from "./views/BotList.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/info",
			name: "Information",
			component: Information
		},
		{
			path: "/bots",
			name: "Bots",
			component: Bots
		},
		{
			path: "/bots/:id",
			name: "Bot",
			component: Bot
		},
		{
			path: "/login",
			name: "Login",
			component: Login
		},
		{
			path: "/password",
			name: "Password",
			component: Password
		},
		{
			path: "/admin",
			name: "Admin",
			component: Admin
		}, {
			path: "/audits",
			component: Audits
		}, {
			path:"/",
			name: "Bot List",
			component: BotList
		}
	]
});
