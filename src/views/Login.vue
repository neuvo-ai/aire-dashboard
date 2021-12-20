<template>
	<div class="Login">
		<i-card
			:title="$t('Log in')"
			style="width: 500px; max-width: 100%; margin: 50px auto 0"
		>
			<!-- <p style="margin-bottom: 20px">
				Login
			</p> -->
			<i-form
				ref="formInline"
				:model="formInline"
				inline
				@submit="handleSubmit"
				@keydown.enter.native="handleSubmit"
			>
				<i-form-item prop="email">
					<i-input
						ref="email"
						v-model="formInline.email"
						type="text"
						:placeholder="$t('Email')"
						autofocus
					>
						<i-icon
							slot="prepend"
							type="ios-person-outline"
						/>
					</i-input>
				</i-form-item>
				<i-form-item prop="password">
					<i-input
						ref="password"
						v-model="formInline.password"
						type="password"
						:placeholder="$t('Password')"
					>
						<i-icon
							slot="prepend"
							type="ios-lock-outline"
						/>
					</i-input>
				</i-form-item>
				<i-form-item>
					<i-button
						type="success"
						@click="handleSubmit()"
					>
						{{ $t("Login") }}
					</i-button>
				</i-form-item>
			</i-form>
		</i-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal, Notice, Spin, Card, Form, FormItem, Input, Icon, Button } from "view-design";
import sha1 from "sha1";
import Axios from "axios";

@Component({
	components: {
		Card,
		Form,
		FormItem,
		Input,
		Icon,
		Button
	}
})
export default class Login extends Vue {
	public formInline = {
		email: "",
		password: ""
	};
	public email = "";
	public resettingPassword = false;

	public created() {
		// filler
	}

	public handleSubmit() {
		const hash = sha1(this.formInline.password).toUpperCase();
		const queryHash = hash.substring(0, 5);
		fetch("https://api.pwnedpasswords.com/range/" + queryHash)
			.then(res => res.text())
			.then(async data => {
				if (data.includes(hash.substring(5, 41))) {
					// @ts-ignore
					Notice.warning({
						duration: 0,
						title: "Dangerous Password",
						render: (h: any) =>
							h("span", [
								"We've noticed that the password you're using isn't secure. It is recommended that you change it immediately.",
								h("br"),
								h("a", {
									domProps: {
										innerHTML: "You can read more about the security of your password on the HIBP website."
									},
									attrs: {
										href: "https://haveibeenpwned.com/Passwords",
										target: "_blank"
									}
								})
							]),
						desc: " You can read more about the security of your password here: https://haveibeenpwned.com/Passwords"
					});
				}
			})
			.catch(err => console.error(err));
		// @ts-ignore
		Spin.show();
		Axios.post(`${process.env.VUE_APP_AUTH_API}/auth/login`, { ...this.formInline })
			.then(async (res: any) => {
				console.log(res.body, res.data);
				console.log({ res, data: res.data });
				if (res.status === 200 && typeof res.data.jwt === "string") {
					// @ts-ignore
					Spin.hide();
					console.log("JWT: ", res.data.jwt);
					window.localStorage.setItem("jwt", res.data.jwt);
					window.localStorage.setItem("refreshToken", res.data.refreshToken);
					Axios.defaults.headers.common.Authorization = `Bearer ${res.data.jwt}`;
					window.localStorage.setItem("email", this.formInline.email);
					this.$store.commit("setEmail", this.formInline.email);
					this.$router.replace("./bots");
				} else {
					console.log(res.data);
					if (res.data.error === "ValidatingError") {
						throw new Error("Invalid email address or password.");
					} else if (res.data.error === "AdminNoPermissions") {
						throw new Error("Permission denied.");
					} else if (res.data.error === "AdminNotFound") {
						throw new Error("No account found for the email address.");
					} else if (res.data.error === "AdminWrongPassword") {
						throw new Error("Incorrect password.");
					} else {
						throw new Error("Unknown error while logging in.");
					}
				}
			})
			.catch(content => {
				// @ts-ignore
				Spin.hide();
				// @ts-ignore
				Modal.error({
					title: "Login Error",
					content
				});
			});
	}
}
</script>
