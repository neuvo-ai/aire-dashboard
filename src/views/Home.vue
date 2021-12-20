<template>
	<div class="information">
		<p>No new system notices or warnings</p>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import {
	Circle,
	Icon,
	Collapse,
	Footer,
	Menu,
	MenuItem,
	Submenu,
	MenuGroup,
	DatePicker,
	// Spin,
	// @ts-ignore
	Panel
} from "view-design";
@Component({
	components: {
		Footer,
		Menu,
		MenuItem,
		Submenu,
		MenuGroup,
		DatePicker,
		"i-circle": Circle,
		Icon,
		Collapse,
		// @ts-ignore
		Panel
	}
})
export default class Information extends Vue {
	public async created() {
		console.log("CREATED");
		// Hack to get scrollbars to appear after login (Spin control causes overflow: "hidden" to be set when Spin.hide() is called on login page)
		document.getElementsByTagName("body")[0].style.overflow = "auto";
	}
}
</script>

<style lang="scss">
.map-wrapper {
	background: #fff !important;
}
.ivu-layout-content {
	position: relative;
}

.ivu-layout-content > div.stats {
	padding: 0;
}

.ivu-picker-panel-body-wrapper.ivu-picker-panel-with-sidebar {
	padding-left: 200px;
}

.ivu-picker-panel-sidebar {
	width: 200px;
	margin-left: -200px;
}

.ivu-date-picker-rel > span {
	padding: 20px;
	margin: 0 -20px;
}

.ivu-menu-item.apply {
	font-weight: bold;
	&.disabled {
		opacity: 0.3;
		pointer-events: none;
		cursor: disabled;
	}
}

.ivu-menu-primary.ivu-menu-horizontal .ivu-menu-item .ivu-date-picker .ivu-select-dropdown {
	top: 50px !important;
	color: var(--primary-color);
}

.ivu-menu-horizontal .ivu-menu-submenu.language-dropdown .ivu-select-dropdown {
	height: 1000px;
	overflow-y: scroll;
	max-height: 80vh;
}

.ivu-card {
	margin: 20px 0;
	.ivu-card-head {
		background: #f7f7f7;
	}
}

.ivu-notice-desc {
	text-align: left !important;
}
.intent-confidence {
	hr {
		margin: 20px 0;
		display: block;
		border: 0;
		background: #dcdee2;
		height: 1px;
	}
}
</style>
