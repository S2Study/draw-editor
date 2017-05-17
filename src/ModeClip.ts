import {EditorProperties} from "./EditorProperties";
import {AbstractModeFill} from "./AbstractModeFill";
import {ClipTransaction} from "@s2study/draw-updater/lib/ClipTransaction";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";

export class ModeClip extends AbstractModeFill<ClipTransaction> {
	private prop: EditorProperties;
	constructor(viewer: DrawViewer,
				tran: ClipTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: ClipTransaction): void {
		// 処理なし。
	}

	setText(text: string): void {
		// 処理なし。
	}
}

