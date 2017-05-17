import {EditorProperties} from "./EditorProperties";
import {AbstractModeStroke} from "./AbstractModeStroke";
import {PathTransaction} from "@s2study/draw-updater/lib/PathTransaction";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";

export class ModeEraser extends AbstractModeStroke<PathTransaction> {

	private prop: EditorProperties;

	constructor(viewer: DrawViewer,
				tran: PathTransaction,
				prop: EditorProperties) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: PathTransaction): void {
		tran.setCompositeOperation(0);
		tran.setStrokeColor(0xffffffff);
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}

	setText(text: string): void {
		// 処理なし。
	}

	protected setCommitProperty(tran: PathTransaction): void {
		tran.setCompositeOperation(6);
		tran.setStrokeColor(0x000000ff);
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}
}

