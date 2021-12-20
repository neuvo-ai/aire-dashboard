<template>
	<div class="audits">
		<i-card>
			<p slot="title">
				{{ $t("Audits") }}
			</p>

			<Collapse>
				<Panel
					:hide-arrow="true"
				>
					{{ $t("Show auditlog types and descriptions") }}
					<p slot="content">
						<Table
							border
							:columns="auditsTypesColumns"
							:data="auditsTypesData"
							size="small"
						>
							<template
								slot="tagType"
								slot-scope="{ row, column }"
							>
								<i-tag :color="typeColor(row[column.key])">
									{{ row[column.key] }}
								</i-tag>
							</template>
						</Table>
					</p>
				</Panel>
			</Collapse>

			<Divider />

			<div>
				<Table
					border
					tooltip-theme="light"
					:loading="loading"
					:columns="auditsColumns"
					:data="paginatedAuditsData"
					size="small"
				>
					<template
						slot="createdAt"
						slot-scope="{ row }"
					>
						<Tooltip
							placement="top"
							transfer
						>
							<Time :time="row.createdAt" />
							<Time
								slot="content"
								:time="row.createdAt"
								type="datetime"
							/>
						</Tooltip>
					</template>
					<template
						slot="tag"
						slot-scope="{ row, column }"
					>
						<Tooltip
							max-width="200"
							placement="left"
							:content="typeDescription(row.type)"
						>
							<i-tag :color="typeColor(row[column.key])">
								{{ row[column.key] }}
							</i-tag>
						</Tooltip>
					</template>
				</Table>
				<div style="margin: 10px; overflow: hidden">
					<div style="float: right">
						<Page
							:total="pages"
							:current.sync="currentPage"
						/>
					</div>
				</div>
			</div>
		</i-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import AuditsTypesYaml from "@/auditlogTypes.yaml";
import { CreateElement } from "vue";
import {
	Page,
	Tag,
	Time,
	Poptip,
	Tooltip,
	Button,
	ButtonGroup,
	Modal,
	Table,
	Spin,
	Input,
	Form,
	FormItem,
	Card,
	Switch,
	Icon,
	Sider,
	MenuItem,
	Menu,
	Submenu,
	Content,
	Layout,
	Collapse,
	Divider,
	// @ts-ignore
	Panel
} from "view-design";

@Component({
	components: {
		Page,
		Poptip,
		Tag,
		Time,
		Tooltip,
		Button,
		ButtonGroup,
		Table,
		Modal,
		Spin,
		Input,
		Form,
		FormItem,
		Card,
		Icon,
		Sider,
		Menu,
		MenuItem,
		Submenu,
		Content,
		Layout,
		Collapse,
		Divider,
		Panel,
		"i-switch": Switch
	}
})
export default class Audits extends Vue {
	public loading = true;
	public auditsData: any = [];
	public auditsColumns: any = [];

	public auditsTypesData: any = [];
	public auditsTypesColumns: any = [];

	public pages = 1;
	public currentPage = 1;

	protected perPage = 10;

	public created() {

		for (const [type, values] of Object.entries(AuditsTypesYaml.names)) {
			this.auditsTypesData.push({values,  type});
		}

		this.auditsTypesColumns = [
			{
				title: this.$t("Type"),
				key: "type",
				sortable: true,
				sortType: "asc",
				slot: "tagType"
			},
			{
				title: this.$t("Description"),
				key: "description",
				render: (h: CreateElement, params: any) => h("div", params.row.values.description)
			}
		];

		this.auditsColumns = [
			{
				title: this.$t("Date"),
				key: "createdAt",
				slot: "createdAt",
				sortable: true,
				width: 200,
				resizable: true
			},
			{
				title: this.$t("Type"),
				key: "type",
				slot: "tag",
				align: "center",
				sortable: true,
				width: 190
			},
			{
				title: this.$t("Admin Email"),
				key: "admin",
				resizable: true,
				minWidth: 100
			},
			{
				title: this.$t("Target Type"),
				key: "target",
				slot: "tag",
				resizable: true,
				maxWidth: 120,
				align: "center"
			},
			{
				title: this.$t("Target"),
				key: "targetValue",
				resizable: true,
				ellipsis: true,
				minWidth: 100
			},
			{
				title: this.$t("IP address"),
				key: "ip",
				width: 150,
				sortable: true,
				resizable: true,
				align: "center"
			}
		];
		this.loadLatestaudits();
	}

	public loadLatestaudits() {
		this.loading = true;
		Axios.get("/audits/audits", { params: { limit: 5000 } })
			.then(res => {
				if (typeof res.data === "object") {
					console.log(res.data);
					this.pages = Math.ceil(res.data.length / this.perPage);
					this.auditsData = res.data;
				} else {
					// @ts-ignore
					throw new Error(this.$t("Error communicating with the server."));
				}
			})
			.catch(e => {
				alert(e);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	public typeColor(type: string) {
		const findType = this.auditsTypesData.find((item: { type: string }) => item.type === type);
		if (typeof type === "string" && type !== "" && typeof findType?.values?.color === "string") {
			return findType.values.color;
		} else {
			return "default";
		}
	}

	public typeDescription(type: string) {
		const findType = this.auditsTypesData.find((item: { type: string }) => item.type === type);
		return findType?.values?.description;
	}

	public get paginatedAuditsData() {
		return this.auditsData.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
	}
}
</script>

<style lang="scss">
.ivu-poptip-body-content-inner {
	white-space: pre;
}
</style>
