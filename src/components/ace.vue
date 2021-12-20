<template>
	<pre
		class="m-ace-editor"
		:style="{
			width: /px|\%|rem/.test(width) ? width : width + 'px',
			height: /px|\%|rem/.test(height) ? height : height + 'px',
			lineHeight: lineHeight
		}"
	/>
</template>
<script lang="ts">
import AceEditor from "brace";
import "brace";
import "brace/mode/html";
import "brace/ext/language_tools";
import "brace/theme/tomorrow";

import { Component, Vue, Watch, Prop } from "vue-property-decorator";
@Component({
	components: {}
})
export default class Ace extends Vue {
	// @ts-ignore
	public editor: AceEditor.Editor;
	public lineHeight: number = 1;
	public theme: string = "tomorrow";
	public mode: string = "html";

	@Prop([String, Number]) public width: string | number = "100%";
	@Prop([String, Number]) public height: string | number = "300px";
	@Prop(String) public value: string | undefined;
	@Prop(Boolean) public lineNumber: boolean = false;

	@Watch("value")
	public onValueChanged(val: string) {
		if (val === this.editor.getValue()) {
			return;
		}
		this.setValue();
	}

	public setValue() {
		this.editor.setValue(this.value || "", 1);
	}

	public setLineNumber() {
		this.editor.renderer.setShowGutter(this.lineNumber);
	}

	public setMode() {
		if (!this.mode) {
			return false;
		}
		this.editor.session.setMode("ace/mode/" + this.mode);
	}

	public setTheme() {
		if (!this.theme) {
			return false;
		}
		this.editor.setTheme("ace/theme/" + this.theme);
	}

	private listening() {
		this.editor.on("change", e => {
			this.$emit("input", this.editor.getValue());
		});
		this.editor.on("blur", e => {
			this.$emit("bulr", this.editor);
		});
		this.editor.on("focus", e => {
			this.$emit("focus", this.editor);
		});
	}
	private mounted() {
		this.editor = AceEditor.edit(this.$el as any);
		this.editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});

		this.editor.setShowPrintMargin(false);

		this.editor.session.setUseWrapMode(true);
		this.setValue();
		this.setLineNumber();
		this.listening();
		this.setMode();
		this.setTheme();
		this.$on("init", this.editor as any);
	}
}
</script>
