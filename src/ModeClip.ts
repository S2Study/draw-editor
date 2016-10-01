import * as drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import {EditorProperties} from "./EditorProperties";
import {AbstractModeFill} from "./AbstractModeFill";
export class ModeClip extends AbstractModeFill<ClipTransaction> {
	private prop: EditorProperties;
	constructor(viewer: DrawchatViewer,
				tran: ClipTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: drawchat.updater.ClipTransaction): void {
		// 処理なし。
	}

	setText(text: string): void {
		// 処理なし。
	}
}

