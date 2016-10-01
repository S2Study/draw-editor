import * as drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawPathTransaction = drawchat.updater.DrawPathTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import {EditorProperties} from "./EditorProperties";
import {AbstractModeStroke} from "./AbstractModeStroke";

export class ModeEraser extends AbstractModeStroke<DrawPathTransaction> {

	private prop: EditorProperties;

	constructor(viewer: DrawchatViewer,
				tran: DrawPathTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: drawchat.updater.DrawPathTransaction): void {
		tran.setCompositeOperation(0);
		tran.setStrokeColor(`rgba(255,255,255,1.0)`);
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}

	setText(text: string): void {
		// 処理なし。
	}

	protected setCommitProperty(tran: drawchat.updater.DrawPathTransaction): void {
		tran.setCompositeOperation(6);
		tran.setStrokeColor(`rgba(0,0,0,1)`);
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}
}

