<template>
	<div class="bot">
		<i-modal
			v-model="modalError"
			:title="$t('Error')"
			@on-ok="modalError = false"
		>
			{{ modalErrorMsg }}
		</i-modal>
		<Card v-if="botData.slug !== ''">
			<p slot="title">
				{{ $t('Bot "{name}"', { name: this.botData.name }) }}
			</p>
			<i-button
				slot="extra"
				type="success"
				:disabled="!isModified"
				:style="{ float: 'right' }"
				@click="save()"
			>
				{{ $t("Save") }}
			</i-button>

			<Row>
				<Col span="8" v-if="botData.status !== 'deployed'">
					<Card style="margin-right: 15px">
						<p slot="title">
							{{ $t("Basic Details") }}
						</p>
						<Steps
							direction="vertical"
							size="small"
							:current="getState()"
							:status="getStatusIcon()"
						>
							<Step
								v-for="(status, index) in states.deployStatus"
								:key="index"
								:title="status.title"
								:content="status.message"
							/>
							<Step
								v-if="botData.status === 'errored'"
								:title="states.errorStatus[states.errorStatus.findIndex((status) => status.status === botData.status)].title"
								:content="states.errorStatus[states.errorStatus.findIndex((status) => status.status === botData.status)].description"
							/>
						</Steps>
					</Card>
				</Col>
				<Col :span="botData.status !== 'deployed' ? 16 : 24">
					<Card>
						<p slot="title">
							{{ $t("Basic Details") }}
						</p>
						<i-form>
							<i-form-item :label="$t('Bot Name')">
								<i-input v-model="botData.name" :readonly="true" :disabled="true" />
							</i-form-item>
							<i-form-item :label="$t('Bot URL')">
								<a class="ivu-input" style="cursor: pointer" :href="botData.url"
									target="_blank"
								>{{botData.url}}</a>
							</i-form-item>
							<i-form-item :label="$t('Bot Description')">
								<i-input v-model="botData.desc" @on-change="compareData" />
							</i-form-item>
							<i-form-item :label="$t('Botfront project id')">
								<i-input v-model="botData.projectId" @on-change="compareData" />
								<small style="color:red;" v-if="!botData.projectId">{{ $t("Can not be empty") }}</small>
							</i-form-item>
							<i-form-item :label="$t('Publicly Visible')">
								<i-switch v-model="botData.public" size="large" @on-change="compareData">
									<span slot="open">{{ $t("On") }}</span>
									<span slot="close">{{ $t("Off") }}</span>
								</i-switch>
							</i-form-item>
							<small style="text-align: left !important; display: block">
								{{ $t("Should this bot be publicly visible in the public listing page") }}
							</small>
						</i-form>
					</Card>
					<Card>
						<p slot="title">
							{{ $t("Botfront User") }}
						</p>
						<Table width="100%" border :columns="credColumns" :data="botData.credentials.server.botfront">
							<template slot="actions" slot-scope="{ row }">
								<i-button
									type="success"
									size="small"
									@click="clickNewPassword(row, 'botfront')"
								>
									{{ $t("New Password") }}
								</i-button>
							</template>
						</Table>
					</Card>
				</Col>
			</Row>

			<Card v-if="botData.status === 'deployed'">
				<p slot="title">
					{{ $t("Preview") }}
				</p>
				<!-- TODO: fetch the Botfront project ID dynamically. The URL we already know -->
				<!-- <iframe
					src="https://kpm-jamk.neuvo.ai/chat/BTGicELz2Xv2DiWNc/"
					style="border: 0; width: 100%; min-height: 600px"
				/> -->
				<iframe
					:src="`${botData.url}/chat/${botData.projectId}/`"
					style="border: 0; width: 100%; min-height: 600px"
				/>
			</Card>
		</Card>
	</div>
</template>
<script lang="ts">
// import Axios from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
// import { Route } from "vue-router";
import { CreateElement } from "vue";
import statuses from "../models/status";

import {
	Card,
	Icon,
	FormItem,
	Tooltip,
	Time,
	Collapse,
	Footer,
	Menu,
	MenuItem,
	Submenu,
	MenuGroup,
	DatePicker,
	Spin,
	Table,
	Input,
	Message,
	// @ts-ignore
	Panel,
	Modal,
	Row,
	Col,
	Steps,
	// @ts-ignore
	Step,
} from "view-design";
import axios from "axios";

Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave", "beforeRouteUpdate"]);

@Component({
	components: {
		Card,
		Footer,
		Menu,
		MenuItem,
		Submenu,
		MenuGroup,
		DatePicker,
		Icon,
		FormItem,
		Tooltip,
		Time,
		Collapse,
		Spin,
		Table,
		Input,
		Message,
		// @ts-ignore
		Panel,
		Modal,
		Row,
		Col,
		Steps,
		Step,
	},
})
export default class Bot extends Vue {
	public states = statuses;
	public botData: any = {
		status: "created",
		tombstoned: false,
		name: "",
		slug: "",
		public: false,
		url: "",
		desc: "",
		projectId: "",
		credentials: {
			server: {
				databases: [],
				botfront: []
			}
		}
	};

	public origBotData: any = {};
	public credColumns: any = [];

	public intervalId: any;

	public modalError: boolean = false;
	public modalErrorMsg: string = "";

	public isModified: boolean = false;

	public created() {
		this.credColumns = [
			{
				title: this.$t("Username"),
				key: "name",
			},
			{
				title: this.$t("Password"),
				key: "password",
			},
			{
				title: this.$t("Actions"),
				slot: "actions",
			},
		];
		this.loadCredentials();
		this.intervalId = setInterval(this.getBotStatus, 10000);
	}

	public beforeRouteLeave(to: any, from: any, next: any) {
		console.log("Before leave activated");
		if (this.isModified) {
			// @ts-ignore
			Modal.confirm({
				title: "Modified",
				content: this.$t("Do you really want to leave? You have unsaved changes!"),
				onOk: () => {
					next();
				},
				onCancel: () => {
					next(false);
				}
			});
		} else {
			next();
		}
	}

	public beforeDestroy() {
		clearInterval(this.intervalId);
	}

	public async loadCredentials() {
		try {
			await axios
				.get(`/bot-creds/${encodeURIComponent(this.$route.params.id)}`)
				.then((res) => {
					Object.assign(this.origBotData, res.data.data);
					Object.assign(this.botData, res.data.data);
				});
		} catch (error) {
			if (error?.response) {
				// @ts-ignore
				Modal.error({
					title: this.$t("Error"),
					content: this.$t(error?.response.data.message),
					onOk:() => {
						this.$router.push("/bots");
					}
				});
			} else {
				console.error(error)
			}
		}
	}

	public async getBotStatus() {
		console.log("Getting bot status");
		await axios
			.get(
				`/bot-creds/status/${encodeURIComponent(this.$route.params.id)}`
			)
			.then(res => {
				this.botData.status = res.data.status;
				if (this.botData.status === "deployed") {
					clearInterval(this.intervalId);
				}
			});
	}

	public clickNewPassword(row: any, section: string) {
		if(section === "botfront") {
			const index = this.botData.credentials.server.botfront.findIndex((user: any) => user.name === row.name);
			this.botData.credentials.server.botfront[index].password = this.generateNewPassword();
		}
		this.compareData();
	}

	public generateNewPassword() {
		return Math.random().toString(36).slice(-10);
	}

	public getState() {
		const index = this.states.deployStatus.findIndex(status => status.status === this.botData.status)
		if(index === -1) {
			return this.states.deployStatus.length;
		} else {
			return index;
		}
	}

	public getStatusIcon() {
		if(this.botData.status === "errored") {
			return this.states.errorStatus[this.states.errorStatus.findIndex(status => status.status === this.botData.status)].icon;
		} else if(this.botData.status === "removing") {
			return "process";
		} else {
			return this.states.deployStatus[this.states.deployStatus.findIndex(status => status.status === this.botData.status)].icon;
		}
	}

	public async save() {
		// Filler
		await axios
			.post(
				`/bot-creds/save-creds/${encodeURIComponent(this.$route.params.id)}`,
				{ botData: this.botData }
			)
			.then((res) => {
				if (res.data.success === true) {
					// @ts-ignore
					Message.success({
						content: this.$t("Successfully saved credentials") as string,
						duration: 6,
					});
					// Reset isModified to stop warning about unsaved changes popping up.
					this.isModified = false;
					this.$router.push({ name: "Bots" });
				} else {
					// @ts-ignore
					Message.error({
						content: this.$t("Failed to save credentials") as string,
						duration: 6,
					});
				}
			});
	}

	public compareData() {
		// Should be replaced with @Watch
		if(JSON.stringify(this.origBotData) === JSON.stringify(this.botData)) {
			this.isModified = false;
		} else {
			this.isModified = true;
		}
	}
}
</script>
