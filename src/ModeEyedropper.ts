import {EditorProperties} from "./EditorProperties";
import {DrawchatCanvas} from "./index";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";

export class ModeEyedropper implements DrawchatCanvas {

	private viewer: DrawViewer;
	private prop: EditorProperties;
	private layerIndex: number;

	constructor(
		layerIndex: number,
		viewer: DrawViewer,
		prop: EditorProperties
	) {
		this.layerIndex = layerIndex;
		this.viewer = viewer;
		this.prop = prop;
	}

	touchStart(x: number, y: number): void {
		let color = this.viewer.getPixelColor(x, y, this.layerIndex);
		this.prop.color.r = color[0];
		this.prop.color.g = color[1];
		this.prop.color.b = color[2];
		this.prop.alpha = color[3];
	}

	touchMove(x: number, y: number): void {
		// 処理なし
	}

	touchEnd(x: number, y: number): void {
		// 処理なし
	}

	setText(text: string): void {
		// 処理なし
	}

	backward(): void {
		// 処理なし
	}
}