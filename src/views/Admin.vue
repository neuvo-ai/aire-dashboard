<template>
	<div class="admins">
		<i-modal
			v-model="modifyingPermissions"
			width="800"
			:title="modifyRow.email"
			@on-ok="modifyPermissionsDone"
			@on-cancel="modifyPermissionsCancel"
		>
			<CheckboxGroup v-model="modifyPerms">
				<Checkbox
					v-for="(permission, key, index) of permissions"
					:key="index"
					:label="key"
					style="display: block"
				>
					<strong>({{ key }}) </strong>
					<span>{{ permission.description }}</span>
				</Checkbox>
			</CheckboxGroup>
		</i-modal>

		<Card>
			<p slot="title">
				{{ $t("Admin Management") }}
			</p>
			<i-button
				slot="extra"
				type="warning"
				:style="{ float: 'right' }"
				@click="addUser(['admin', 'super'])"
			>
				{{ $t("Add new administrator") }}
			</i-button>
			<i-button
				slot="extra"
				type="success"
				:style="{ float: 'right' }"
				@click="addUser(['admin'])"
			>
				{{ $t("Add new user") }}
			</i-button>
			<br :style="{ clear: 'both' }">
			<br>
			<Table
				width="100%"
				border
				:columns="cols"
				:data="admins"
			>
				<template
					slot="timestamp"
					slot-scope="{ column, row }"
				>
					<Tooltip
						placement="top"
						transfer
					>
						<Time :time="row[column.key]" />
						<Time
							slot="content"
							:time="row[column.key]"
							type="datetime"
						/>
					</Tooltip>
				</template>
			</Table>
		</Card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import { Card, Modal, Tooltip, Time, Table, CheckboxGroup, Checkbox, Spin, Tag, Input, ModalConfig } from "view-design";
import { CreateElement } from "vue";

@Component({
	components: {
		Card,
		Table,
		Tooltip,
		Time,
		Modal,
		CheckboxGroup,
		Checkbox
	}
})
export default class Admin extends Vue {
	public loading = true;
	public admins = [];
	public newAdminEmail = "";
	public cols: any = [];
	public modifyingPermissions = false;
	public modifyRow: any = {};
	public modifyPerms: any = [];
	public permissions = {
		admin: {
			description: this.$t("Has permission to manage bots")
		},
		super: {
			description: this.$t("Has permission to manage admins and view audits")
		}
	};

	public created() {
		this.cols = [
			{
				title: this.$t("Email"),
				key: "email"
			},
			{
				title: this.$t("Created"),
				key: "createdAt",
				slot: "timestamp"
			},
			{
				title: this.$t("Last Modified"),
				key: "updatedAt",
				slot: "timestamp"
			},
			{
				title: this.$t("Permissions"),
				key: "permissions",
				render: (h: CreateElement, params: any) => {
					const permissionTags = [];
					for (const permission of params.row.permissions) {
						permissionTags.push(h(Tag, permission));
					}
					return h("div", permissionTags);
				}
			},
			{
				title: this.$t("Actions"),
				fixed: "right",
				render: (h: CreateElement, params: any) =>
					h("div", [
						h(
							"Button",
							{
								props: {
									type: "default",
									size: "small"
								},
								on: {
									click: () => {
										this.modifyPermissions(params.row);
									}
								}
							},
							this.$t("Modify Permissions") as string
						),
						h(
							"Button",
							{
								props: {
									type: "default",
									size: "small"
								},
								on: {
									click: () => {
										this.resetPassword(params.row._id);
									}
								}
							},
							this.$t("Reset Password") as string
						),
						h(
							"Button",
							{
								props: {
									type: "error",
									size: "small"
								},
								on: {
									click: async () => {
										if (confirm(this.$t("Are you sure you want to remove {email}?", { email: params.row.email }) as string)) {
											// @ts-ignore
											Spin.show();
											Axios.delete(`/admin/${encodeURIComponent(params.row._id)}`)
												.then(_res => {
													// @ts-ignore
													Modal.success({
														title: this.$t("Admin removed!")
													});
													this.loadAdmins();
												})
												.catch(e => {
													// @ts-ignore
													Modal.error({
														title: this.$t("Error"),
														content: this.$t("Removing user failed.") + " " + e
													});
												});
											// @ts-ignore
											Spin.hide();
										}
									}
								}
							},
							this.$t("Remove") as string
						)
					])
			}
		];
		this.loadAdmins();
	}

	public loadAdmins() {
		Axios.get("/admin").then(res => {
			if (res.data.success === true) {
				this.admins = res.data.admins;
			} else {
				throw this.$t("Error communicating with the server.");
			}
			this.loading = false;
		});
	}

	public addUser(permissions: any = ["stats"]) {
		this.newAdminEmail = "";
		// @ts-ignore
		Modal.confirm({
			okText: this.$t("Ok"),
			cancelText: this.$t("Cancel"),
			render: (h: CreateElement | undefined) =>
				h?.(Input, {
					props: {
						value: this.newAdminEmail,
						autofocus: true,
						placeholder: this.$t("Email address of the new account")
					},
					on: {
						input: (val: string) => {
							this.newAdminEmail = val;
						}
					}
				}),
			onOk: () => {
				// @ts-ignore
				Spin.show();
				Axios.post("/admin/add", {
					email: this.newAdminEmail,
					permissions
				})
					.then(async res => {
						// Hack to wait for the top level modal to close.
						await new Promise(resolve => setTimeout(resolve, 500));
						if (res.data.success === true && res.data.password === undefined) {
							// @ts-ignore
							new Modal.success({
								title: this.$t("Account added") as string,
								render: (h: CreateElement | undefined) => h?.("span", [h?.("span", (this.$t("Email:") as string) + " "), h?.("strong", this.newAdminEmail)])
							});
						} else if (res.data.success === true && res.data.password) {
							// @ts-ignore
							Modal.success({
								title: this.$t("New account created") as string,
								render: (h: CreateElement | undefined) => h?.("span", [h?.("span", (this.$t("Email:") as string) + " "), h?.("strong", this.newAdminEmail), h?.("br"), h?.("span", (this.$t("Password:") as string) + " "), h?.("strong", res.data.password), h?.("br"), h?.("small", this.$t("(This password is only shown once.)") as string)])
							});
						} else {
							// @ts-ignore
							new Modal.info({
								title: this.$t("Account already exists") as string,
								render: (h: CreateElement | undefined) => h?.("span", [h?.("span", (this.$t("Email:") as string) + " "), h?.("strong", this.newAdminEmail)])
							});
						}
						this.loadAdmins();
					})
					.catch(e => {
						if (e.response && e.response.data.error === "ValidatingError") {
							alert(this.$t("Invalid email address"));
						} else {
							alert(e);
						}
					})
					.finally(() => {
						// @ts-ignore
						Spin.hide();
					});
			}
		} as ModalConfig);
	}

	public async resetPassword(id: string) {
		// @ts-ignore
		Spin.show();
		Axios.post(`/admin/reset/${encodeURIComponent(id)}`)
			.then(res => {
				// @ts-ignore
				Modal.success({
					title: this.$t("Reset Password") as string,
					render: (h: CreateElement | undefined) => h?.("span", [h?.("span", (this.$t("Password:") as string) + " "), h?.("strong", res.data.password), h?.("br"), h?.("small", this.$t("(This password is only shown once.)") as string)])
				});
			})
			.catch(e => {
				// @ts-ignore
				Modal.error({
					title: this.$t("Error"),
					content: this.$t("Resetting password.") + " " + e
				});
			});
		// @ts-ignore
		Spin.hide();
	}

	public modifyPermissions(row: any) {
		this.modifyingPermissions = true;
		this.modifyRow = row;
		this.modifyPerms = this.modifyRow.permissions;
	}

	public modifyPermissionsDone() {
		// @ts-ignore
		Spin.show();
		console.log(this.modifyRow);
		Axios.post(`/admin/permissions/${encodeURIComponent(this.modifyRow._id)}`, { permissions: this.modifyPerms })
			.then(_res => {
				this.loadAdmins();
			})
			.catch(e => {
				if (e.response && e.response.data.error === "ValidatingError") {
					alert("ValidatingError");
				} else {
					alert(e);
				}
			})
			.finally(() => {
				// @ts-ignore
				Spin.hide();
				this.modifyRow = {};
			});
	}
	public modifyPermissionsCancel() {
		this.modifyRow = {};
		this.loadAdmins();
	}
}
</script>

<style lang="scss">
.admins button {
	margin: 0 3px;
}
</style>
