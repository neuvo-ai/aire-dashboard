<template>
	<div
		id="app"
		:data-path="$route.path"
	>
		<div
			v-if="$route.name != 'Login' && $route.name != 'Bot List'"
			class="layout"
		>
			<Layout>
				<Header :style="{ position: 'fixed', width: '100%', padding: 0, background: 'transparent', 'z-index': 1001 }">
					<Menu
						mode="horizontal"
						theme="light"
						:active-name="$route.path"
					>
						<img
							src="/img/jamk-rehabilitation.png"
							style="float: left; width: 110px; margin: 12px 5px 0px 21px"
						>
						<template v-for="item in navigation">
							<MenuItem
								v-if="typeof item.permission === 'undefined' || (typeof $router.currentRoute.meta.permissions === 'object' && $router.currentRoute.meta.permissions.includes(item.permission))"
								:key="item.path"
								:name="item.to"
								:to="item.to"
							>
								<Icon :type="item.icon" />
								{{ $t(item.name) }}
							</MenuItem>
						</template>

						<Submenu
							name="10"
							:style="{ float: 'right' }"
						>
							<template slot="title">
								<Icon type="ios-person" />
								{{ $store.state.email }}
							</template>
							<MenuGroup :title="$t('Language')">
								<MenuItem
									name="ui-language-fi"
									:class="{ active: $i18n.locale == 'fi' }"
									@click.native="language('fi')"
								>
									Finnish
								</MenuItem>
								<MenuItem
									name="ui-language-en"
									:class="{ active: $i18n.locale == 'en' }"
									@click.native="language('en')"
								>
									English
								</MenuItem>
							</MenuGroup>
							<MenuGroup :title="$t('Actions')">
								<MenuItem
									name="11"
									to="/password"
								>
									<Icon type="md-lock" />
									{{ $t("Change Password") }}
								</MenuItem>
								<MenuItem
									name="12"
									@click.native="logout()"
								>
									<Icon type="md-exit" />
									{{ $t("Log Out") }}
								</MenuItem>
							</MenuGroup>
						</Submenu>
					</Menu>
				</Header>
				<Content
					:style="{ margin: '88px 20px 0', padding: '0', background: '#fff', minHeight: '500px' }"
					class="main-content"
				>
					<router-view />
				</Content>
				<Footer class="layout-footer-center">
					{{ new Date().getFullYear() }} &copy; Neuvo Inc. Global - v{{ version }}
				</Footer>
			</Layout>
		</div>
		<Layout
			v-else
			class="login-wrapper"
			style="min-height: 100vh"
		>
			<router-view />
			<Footer class="layout-footer-center text-center">
				{{ new Date().getFullYear() }} &copy; Neuvo Inc. Global - v{{ version }}
			</Footer>
		</Layout>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
	Button,
	Layout,
	Header,
	Menu,
	// @ts-ignore
	Submenu,
	MenuItem,
	MenuGroup,
	Icon,
	Content,
	Footer,
	Modal,
	Message,
	Notice,
	Tag
} from "view-design";

@Component({
	components: {
		Button,
		Layout,
		Header,
		Menu,
		// @ts-ignore
		Submenu,
		MenuItem,
		MenuGroup,
		Icon,
		Content,
		Footer,
		Modal,
		Notice,
		Tag
	}
})
export default class App extends Vue {
	public version: any = "DEV";
	public navigation: any = [
		{
			to: "/info",
			icon: "ios-home",
			name: "Information",
			permission: "admin"
		},
		{
			to: "/bots",
			icon: "ios-ionitron",
			name: "Bots",
			permission: "admin"
		},
		{
			to: "/admin",
			icon: "ios-key",
			name: "Admin",
			permission: "super"
		},
		{
			to: "/audits",
			icon: "ios-construct",
			name: "Audits",
			permission: "super"
		}
	];
	public refreshing: boolean = false;
	public registration: any = undefined;

	public created() {
		this.version = process.env.VUE_APP_VERSION;
		console.log("Loading stuff to vuex");
		// @ts-ignore
		Notice.config({
			duration: 0,
			top: 120
		});
		document.addEventListener("swUpdated", this.showRefreshUI, { once: true });

		navigator.serviceWorker.addEventListener("controllerchange", () => {
			if (this.refreshing) {
				return;
			}
			this.refreshing = true;
			window.location.assign(window.location.origin);
		});
	}

	public logout() {
		window.localStorage.removeItem("email");
		window.localStorage.removeItem("jwt");
		window.localStorage.removeItem("refreshToken");
		// @ts-ignore
		Message.success({
			content: this.$t("Logged out"),
			duration: 30,
			closable: true
		});
		this.$router.replace("/login");
	}

	public language(code: string) {
		this.$i18n.locale = code;
		window.localStorage.setItem("language", code);
	}

	public showRefreshUI(e: any) {
		this.registration = e.detail;
		// @ts-ignore
		Notice.info({
			title: this.$t("Update available"),
			render: (h: any) =>
				h(
					Button,
					{
						props: {
							type: "success",
							long: true,
							ghost: true
						},
						on: {
							click: this.refreshApp
						}
					},
					this.$t("Update") as string
				)
		});
	}

	public refreshApp() {
		if (!this.registration || !this.registration.waiting) {
			return;
		}
		this.registration.waiting.postMessage("skipWaiting");
	}
}
</script>

<style lang="less">
@import "~view-design/src/styles/index.less";
// Here are the variables to cover, such as:
@primary-color: #25638a;
@dark-color: #133144;
@bg-color: #eceff3;

:root {
	--primary-color: @primary-color;
	--dark-color: @dark-color;
	--bg-color: @bg-color;
}
</style>

<style lang="scss">
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: var(--primary-color);
	min-height: 100vh;
	.ivu-layout {
		min-height: 100vh;
	}
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: var(--primary-color);
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
.ivu-alert-info {
	border: 1px solid var(--primary-color);
	background-color: var(--bg-color);
}
.ivu-layout-content.main-content > div {
	padding: 50px;
}
.ivu-layout-header {
	z-index: 1000;
}
.dark {
	color: var(--dark-color);
}

.ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item.active {
	font-weight: bold;
}

[data-path="/"] .ivu-layout-content.main-content,
[data-path="/intent"] .ivu-layout-content.main-content,
[data-path="/content"] .ivu-layout-content.main-content,
[data-path^="/super"] .ivu-layout-content.main-content {
	margin: 60px 0px 0px !important;
}

.ivu-layout-content.main-content > div.full {
	// .ivu-layout-content {
	// 	padding-top: 0;
	// }
	padding: 0;
}

.pre-wrap {
	white-space: pre-wrap; /* css-3 */
	white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
	white-space: -pre-wrap; /* Opera 4-6 */
	white-space: -o-pre-wrap; /* Opera 7 */
	word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.text-center {
	text-align: center;
}

.full-width {
	width: 100%;
}
</style>
