import drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawPathTransaction = drawchat.updater.DrawPathTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;

import {EditorProperties} from "./EditorProperties";
import {AbstractModeStroke} from "./AbstractModeStroke";

export class ModeStroke extends AbstractModeStroke<DrawPathTransaction> {

	private prop: EditorProperties;

	constructor(viewer: DrawchatViewer,
				tran: DrawPathTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: drawchat.updater.DrawPathTransaction): void {
		tran.setStrokeColor(`rgba(${
			this.prop.color.r
			},${
			this.prop.color.g
			},${
			this.prop.color.b
			},${
			this.prop.alpha
			})`);
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}

	protected setCommitProperty(tran: drawchat.updater.DrawPathTransaction): void {
	}
}

