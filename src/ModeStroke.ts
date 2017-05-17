import {EditorProperties} from "./EditorProperties";
import {AbstractModeStroke} from "./AbstractModeStroke";
import {PathTransaction} from "@s2study/draw-updater/lib/PathTransaction";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";

export class ModeStroke extends AbstractModeStroke<PathTransaction> {

	private prop: EditorProperties;

	constructor(
		viewer: DrawViewer,
		tran: PathTransaction,
		prop: EditorProperties
	) {
		super(viewer, tran, prop);
		this.prop = prop;
	}

	protected setProperty(tran: PathTransaction): void {
		tran.setStrokeColor(this.prop.color.getAlphaNumber(this.prop.alpha));
		tran.setStrokeStyle(
			this.prop.thickness
		);
	}

	protected setCommitProperty(tran: PathTransaction): void {
	}
}

