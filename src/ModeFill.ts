import {EditorProperties} from "./EditorProperties";
import {AbstractModeFill} from "./AbstractModeFill";
import {PathTransaction} from "@s2study/draw-updater/lib/PathTransaction";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";
export class ModeFill extends AbstractModeFill<PathTransaction> {

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
		tran.setFill(this.prop.color.getAlphaNumber(this.prop.alpha));
	}

	setText(text: string): void {
		// 処理なし。
	}
}

