<template>
	<div class="password">
		<i-card
			:title="$t('Change Password')"
			style="max-width: 500px; width: 100%; margin: auto"
		>
			<i-form
				ref="formInline"
				:model="formInline"
				@submit="handleSubmit"
			>
				<i-form-item prop="password">
					<i-input
						v-model="formInline.oldPassword"
						type="password"
						:placeholder="$t('Old Password')"
					>
						<i-icon
							slot="prepend"
							type="ios-lock-outline"
						/>
					</i-input>
				</i-form-item>
				<br>
				<i-form-item prop="password">
					<i-input
						v-model="formInline.newPassword"
						type="password"
						:placeholder="$t('New Password')"
					>
						<i-icon
							slot="prepend"
							type="ios-lock-outline"
						/>
					</i-input>
				</i-form-item>
				<i-form-item prop="password">
					<i-input
						v-model="formInline.newPasswordRepeat"
						type="password"
						:placeholder="$t('Repeat New Password')"
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
						:disabled="formInline.newPassword !== formInline.newPasswordRepeat || formInline.newPassword === ''"
						@click="handleSubmit()"
					>
						{{ $t("Change") }}
					</i-button>
				</i-form-item>
			</i-form>
		</i-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal, Notice, Spin, Card, Form, FormItem, Input, Icon, Button, Message } from "view-design";
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
export default class Password extends Vue {
	public formInline = {
		oldPassword: "",
		newPassword: "",
		newPasswordRepeat: ""
	};

	public created() {
		// filler
	}

	public changePassword() {
		Axios.post(`${process.env.VUE_APP_AUTH_API}/auth/password`, {
			email: window.localStorage.getItem("email"),
			oldPassword: this.formInline.oldPassword,
			newPassword: this.formInline.newPassword
		})
			.then(async (_res: any) => {
				// @ts-ignore
				Spin.hide();
				// @ts-ignore
				Modal.success({
					title: this.$t("Password changed."),
					onOk: () => {
						console.log("We are in the logout portion");
						window.localStorage.removeItem("email");
						window.localStorage.removeItem("jwt");
						window.localStorage.removeItem("refreshToken");
						// @ts-ignore
						Message.success({
							content: "Logged out.",
							duration: 30,
							closable: true
						});
						this.$router.replace("/login");
					}
				});
				this.formInline.oldPassword = "";
				this.formInline.newPassword = "";
				this.formInline.newPasswordRepeat = "";
			})
			.catch((error: any) => {
				let content = error;
				if (typeof error.response.data === "object") {
					if (error.response.data.error === "ValidatingError") {
						content = this.$t("Wrongly formatted password.");
					} else if (error.response.data.error === "AdminNotFound") {
						content = this.$t("Account not found.");
					} else if (error.response.data.error === "PasswordChangeFailed") {
						content = this.$t("Incorrect old password.");
					} else {
						content = this.$t("Unknown error while changing password.");
					}
				}
				console.log(content);
				// @ts-ignore
				Spin.hide();
				// @ts-ignore
				Modal.error({
					title: this.$t("Error changing password"),
					content
				});
			});
	}

	public handleSubmit() {
		// @ts-ignore
		Spin.show();
		const hash = sha1(this.formInline.newPassword).toUpperCase();
		const queryHash = hash.substring(0, 5);
		fetch("https://api.pwnedpasswords.com/range/" + queryHash)
			.then(res => res.text())
			.then(async data => {
				if (data.includes(hash.substring(5, 41))) {
					// @ts-ignore
					Notice.error({
						duration: 0,
						title: "Dangerous Password",
						render: (h: any) =>
							h("span", [
								this.$t("We've noticed that the password you're trying to use isn't secure. If you use the same password elsewhere, it is also recommended that you change those immediately."),
								h("br"),
								h("a", {
									domProps: {
										innerHTML: this.$t("You can read more about the security of your password on the HIBP website.")
									},
									attrs: {
										href: "https://haveibeenpwned.com/Passwords",
										target: "_blank"
									}
								})
							]),
						desc: this.$t(" You can read more about the security of your password here: https://haveibeenpwned.com/Passwords")
					});
					// @ts-ignore
					Spin.hide();
				} else {
					this.changePassword();
				}
			})
			.catch(err => {
				console.error(err);
				this.changePassword();
			});
	}
}
</script>
