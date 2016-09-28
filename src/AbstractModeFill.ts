import drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawPathTransaction = drawchat.updater.DrawPathTransaction;
import PathTransaction = drawchat.updater.PathTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;

import {EditorProperties} from "./EditorProperties";
import {PathDrawer} from "./PathDrawer";
import {Point} from "./PointArray";
export abstract class AbstractModeFill<T extends PathTransaction> implements DrawchatCanvas {

	private viewer: DrawchatViewer;
	private tran: T;
	private pathDrawer: PathDrawer;

	constructor(
		viewer: DrawchatViewer,
		tran: T,
		prop: EditorProperties
	) {
		this.viewer = viewer;
		this.tran = tran;
		this.tran.setSavePoint();
		this.pathDrawer = new PathDrawer(tran, prop);
		this.lPointX = -100;
		this.lPointY = -100;
	}

	private time: number;

	lPointX: number;
	lPointY: number;

	private wPointX: number;
	private wPointY: number;
	private waiting: boolean;


	touchStart(x: number, y: number): void {
		this.touchMove(x, y);
	}

	touchMove(x: number, y: number): void {
		if (!this.tran.isAlive()) {
			return;
		}
		let latest = this.time;
		this.time = new Date().getTime();

		if ((this.time - latest) >= 50) {
			// this.tran.restoreSavePoint();
			this.doFill(x, y);
			return;
		}

		let x1 = x - this.lPointX;
		let y1 = y - this.lPointY;

		let d = Math.sqrt(x1 * x1 + y1 * y1);
		if (d < 5) {
			this.wPointX = x;
			this.wPointY = y;
			this.setWait();
			return;
		}
		this.doFill(x, y);
	}

	touchEnd(x: number, y: number): void {
		this.touchMove(x, y);
	}

	private setWait(): void {
		if (this.waiting) {
			return;
		}
		this.waiting = true;
		setTimeout(() => {
			if (!this.waiting) {
				return;
			}
			this.waiting = false;
			if (!this.tran.isAlive()) {
				return;
			}
			let now = new Date().getTime();
			if (now - this.time < 100) {
				this.setWait();
				return;
			}
			this.doFill(this.wPointX, this.wPointY);
		}, 100);
	}

	private doFill(x: number, y: number): void {
		this.waiting = false;
		this.lPointX = x;
		this.lPointY = y;
		this.viewer.stop();
		try {
			this.tran.restoreSavePoint();
			this.setProperty(this.tran);

			if (x < 0 && y < 0) {
				this.pathDrawer.doPlot(true);
				return;
			}
			this.pathDrawer.push(this.lPointX, this.lPointY).doPlot(true);
		} finally {
			this.tran.flush();
			this.viewer.start();
		}
	}

	protected abstract setProperty(tran: T): void;

	setText(text: string): void {
		// 処理なし。
	}

	backward(): void {
		this.pathDrawer.pop();
		let point: Point = this.pathDrawer.pop();
		if (point != null) {
			point = {
				x: -100,
				y: -100
			};
		}
		this.doFill(point.x, point.y);
	}
}

