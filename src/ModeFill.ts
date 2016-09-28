import drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawPathTransaction = drawchat.updater.DrawPathTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;

import {EditorProperties} from "./EditorProperties";
import {AbstractModeFill} from "./AbstractModeFill";
export class ModeFill extends AbstractModeFill<DrawPathTransaction> {

	private prop: EditorProperties;

	constructor(viewer: DrawchatViewer,
				tran: DrawPathTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: drawchat.updater.DrawPathTransaction): void {
		tran.setFill(`rgba(${this.prop.color.r},${this.prop.color.g},${this.prop.color.b},${this.prop.alpha})`);
	}

	setText(text: string): void {
		// 処理なし。
	}
}

