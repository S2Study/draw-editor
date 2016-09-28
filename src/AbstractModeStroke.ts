import drawchat from "@s2study/draw-api";

import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import ClipTransaction = drawchat.updater.ClipTransaction;
import DrawPathTransaction = drawchat.updater.DrawPathTransaction;
import PathTransaction = drawchat.updater.PathTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;

import {EditorProperties} from "./EditorProperties";
import {PathDrawer} from "./PathDrawer";

export abstract class AbstractModeStroke<T extends PathTransaction> implements DrawchatCanvas {

	private viewer: DrawchatViewer;
	private tran: T;
	private pathDrawer: PathDrawer;

	constructor(viewer: DrawchatViewer,
				tran: T,
				prop: EditorProperties) {
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
	private reset: boolean;
	private commitReserve: boolean;
	private started: boolean;

	touchStart(x: number, y: number): void {
		if (!this.tran.isAlive()) {
			return;
		}
		this.checkLastAccess();
		this.tran.setSavePoint();
		this.pathDrawer.clear();
		this.doStroke(x, y);
		this.started = true;
	}

	touchMove(x: number, y: number): void {
		if (!this.tran.isAlive()) {
			return;
		}
		this.checkLastAccess();

		let latest = this.time;
		this.time = new Date().getTime();
		if ((this.time - latest) >= 50) {
			this.doStroke(x, y);
			return;
		}
		let x1 = x - this.lPointX;
		let y1 = y - this.lPointY;

		let d = Math.sqrt(x1 * x1 + y1 * y1);
		if (d < 50) {
			this.time = latest;
			this.wPointX = x;
			this.wPointY = y;
			this.setWait();
			return;
		}
		this.doStroke(x, y);
	}

	touchEnd(x: number, y: number): void {
		if (!this.started) {
			return;
		}
		this.started = false;
		if (!this.tran.isAlive()) {
			return;
		}
		this.checkLastAccess();
		if (this.lPointX === x && this.lPointY === y) {
			this.setCommitProperty(this.tran);
			this.tran.commit(true);
			this.pathDrawer.clear();
			return;
		}
		this.time = new Date().getTime();
		this.doStroke(x, y);
		this.setCommitProperty(this.tran);
		this.tran.commit(true);
		this.pathDrawer.clear();
	}

	private checkLastAccess(): void {
		if (this.commitReserve) {
			this.reset = true;
			return;
		}
		this.commitReserve = true;
		setTimeout(() => {
			if (this.reset) {
				this.reset = false;
				this.checkLastAccess();
				return;
			}
			this.commitReserve = false;
			this.setCommitProperty(this.tran);
			this.tran.commit(true);
			this.pathDrawer.clear();
		}, 1000);
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
			this.doStroke(this.wPointX, this.wPointY);
		}, 100);
	}

	private doStroke(x: number, y: number): void {
		this.viewer.stop();
		try {
			this.waiting = false;
			this.lPointX = x;
			this.lPointY = y;
			this.tran.restoreSavePoint();
			this.setProperty(this.tran);
			this.pathDrawer.push(this.lPointX, this.lPointY).doPlot(false, false);

		} finally {
			this.tran.flush();
			this.viewer.start();
		}
	}

	protected abstract setCommitProperty(tran: T): void;

	protected abstract setProperty(tran: T): void;

	setText(text: string): void {
		// 処理なし。
	}

	backward(): void {
		// 処理なし。
	}
}

