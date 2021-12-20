<template>
	<div
		class="botlist"
		style="width: 90%; margin-left: auto; margin-right: auto"
	>
		<i-card>
			<img
				slot="title"
				src="/img/jamk-rehabilitation.png"
				style="
					display: block;
					margin-left: auto;
					margin-right: auto;
					width: 50%;
				"
			/>
			<i-card>
				<h1 slot="title">
					{{ $t("Publicly Available Chat Bots") }}
				</h1>
				<i-button
					slot="extra"
					size="small"
					@click="$router.push({ name: 'Information' })"
				>
					{{ $t("Login") }}
				</i-button>
				<Table
					:columns="botColumns"
					:data="publicBots"
				>
					<template slot="url" slot-scope="{ row }">
						<a :href="row.url" target="_blank">
							{{ row.url }}
						</a>
					</template>
					<template slot-scope="{ row }" slot="action">
						<template v-if="row.projectId">
							<Button type="success" @click="openChatWindow(true, row)" size="small" :title="$t('Chat data will be cleared, when browser window is closed')" style="margin-right: 5px">{{ $t("Incognito mode") }}<Icon type="ios-open-outline" /></Button>
							<Button type="default" @click="openChatWindow(false, row)" size="small" :title="$t('Chat data will not be cleared when browser window is closed')" style="margin-right: 5px">{{ $t("Open") }}<Icon type="ios-open-outline" /></Button>
						</template>
						<template v-if="!row.projectId">{{ $t("bot id is missing") }}</template>
					</template>
				</Table>
			</i-card>
		</i-card>
		<Card v-if="preview !== ''">
			<p slot="title">
				{{ $t("Preview") }}
			</p>
			<!-- TODO: fetch the Botfront project ID dynamically. The URL we already know -->
			<!-- <iframe
					src="https://kpm-jamk.neuvo.ai/chat/BTGicELz2Xv2DiWNc/"
					style="border: 0; width: 100%; min-height: 600px"
				/> -->
			<iframe
				:src="`${preview}/chat/pW2WEr9JJoWauvFge/`"
				style="border: 0; width: 100%; min-height: 600px"
			/>
		</Card>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card, Table, Icon } from "view-design";
import axios from "axios";

@Component({
	components: {
		Card,
		Table,
		Icon
	},
})
export default class Bot extends Vue {
	public botColumns: any = {};
	// name, desc, url
	public publicBots: any = [];

	public preview = "";

	public created() {
		this.botColumns = [
			{
				title: this.$t("Name"),
				key: "name",
			},
			{
				title: this.$t("Description"),
				key: "desc",
			},
			{
				title: this.$t("Bot edit URL"),
				key: "url",
				slot: "url",
			},
			{
				title: this.$t("Open chat"),
				key: "action",
				slot: "action"
			},
		];
		axios.get("/public/").then((res) => {
			if (res.data) {
				this.publicBots = res.data.botList;
			}
		});
	}

	public openChatWindow(privateSession: boolean, row: any) {
		if (privateSession) {
			window.open(`${row.url}/chat/${row.projectId}?private=true`);
		} else {
			window.open(`${row.url}/chat/${row.projectId}`);
		}
	}
}
</script>
