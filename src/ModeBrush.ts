import * as drawchat from "@s2study/draw-api";


import {EditorProperties} from "./EditorProperties";
import {PathTransaction} from "@s2study/draw-updater/lib/PathTransaction";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";
import {BrushDrawer} from "./BrushDrawer";
import {PointBrushList, PointList} from "./PointArray";
import {DrawchatCanvas} from "./index";
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";

export class ModeBrush<T extends PathTransaction> implements DrawchatCanvas {

	private viewer: DrawViewer;
	private tran: T;
	private pathDrawer: BrushDrawer;
	private prop: EditorProperties;

	private static INPUT: PointBrushList = new PointBrushList(50);
	private static GO_LIST: PointList = new PointList(51);
	private static RE_LIST: PointList = new PointList(51);

	constructor(
		viewer: DrawViewer,
		tran: T,
		prop: EditorProperties
	) {
		this.viewer = viewer;
		this.tran = tran;
		this.prop = prop;
		this.tran.setSavePoint();
		this.pathDrawer = new BrushDrawer(
			tran, prop, ModeBrush.INPUT, ModeBrush.GO_LIST, ModeBrush.RE_LIST
		);
		this.lPointX = -100;
		this.lPointY = -100;
		this.wForce = null;
	}

	private time: number;
	lPointX: number;
	lPointY: number;

	private wForce: number | null;
	private wPointX: number;
	private wPointY: number;
	private waiting: boolean;
	private reset: boolean;
	private commitReserve: boolean;
	private started: boolean;

	touchStart(x: number, y: number, force?: number | null ): void {

		if (!this.tran.isAlive()) {
			return;
		}

		this.checkLastAccess();
		this.tran.setSavePoint();
		this.pathDrawer.clear();
		this.doStroke(
			x,
			y,
			this.getDistance(x, y, x, y, 0, DrawAPIUtils.complement(force, null))
		);
		this.time = Date.now();
		this.started = true;
	}

	touchMove(x: number, y: number, force?: number | null): void {
		if (!this.tran.isAlive()) {
			return;
		}
		this.checkLastAccess();

		let latest = this.time;
		this.time = Date.now();
		if ((this.time - latest) >= 50) {
			this.doStroke(
				x,
				y,
				this.getDistance(
					x,
					y,
					this.lPointX,
					this.lPointY,
					this.time - latest,
					DrawAPIUtils.complement(force, null)
				)
			);
			return;
		}
		let x1 = x - this.lPointX;
		let y1 = y - this.lPointY;

		let d = Math.sqrt(x1 * x1 + y1 * y1);
		if (d < 50) {
			this.time = latest;
			this.wPointX = x;
			this.wPointY = y;
			this.wForce = DrawAPIUtils.complement(force, null);
			this.setWait();
			return;
		}

		this.doStroke(
			x,
			y,
			this.getDistance(
				x,
				y,
				this.lPointX,
				this.lPointY,
				this.time - latest,
				DrawAPIUtils.complement(force, null)
			)
		);
	}

	touchEnd(x: number, y: number, force?: number | null): void {
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

		let now = Date.now();
		this.doStroke(
			x,
			y,
			this.getDistance(
				this.lPointX,
				this.lPointY,
				x,
				y,
				now - this.time,
				DrawAPIUtils.complement(force, null)
			)
		);
		this.time = now;

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

			let now = Date.now();
			let during = now - this.time;
			if (during < 100) {
				this.setWait();
				return;
			}

			this.doStroke(
				this.wPointX,
				this.wPointY,
				this.getDistance(
					this.lPointX,
					this.lPointY,
					this.wPointX,
					this.wPointY,
					during,
					this.wForce
				)
			);
			this.time = now;
		}, 100);
	}

	private doStroke(x: number, y: number, dis: number): void {
		this.viewer.stop();
		try {

			this.waiting = false;
			this.lPointX = x;
			this.lPointY = y;
			this.tran.restoreSavePoint();
			this.setProperty(this.tran);
			this.pathDrawer.push(this.lPointX, this.lPointY, dis).doPlot(false);

		} finally {
			this.tran.flush();
			this.viewer.start();
		}
	}

	private getDistance(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		during: number,
		force: number | null
	): number {
		if (force !== null) {

			let pow = 1 / ( 1 + Math.exp(-force * 5));
			pow = Math.pow(3, pow * 2 - 1);
			return isNaN(pow) ? this.prop.thickness : pow * this.prop.thickness;
			// return ( force * 1.5 + 0.5 ) * this.prop.thickness;
			// return Math.min(Math.max(force, 2), 1 / 2) * this.prop.thickness;
		}

		let disX = x1 - x2;
		let disY = y1 - y2;
		let d = Math.sqrt(disX * disX + disY * disY);
		if (d === 0) {
			return this.prop.thickness;
		}

		const thickness = during / d;
		// console.log(thickness);
		return Math.max(Math.min(thickness, 2), 1 / 2) * this.prop.thickness;
	}

	protected setProperty(tran: PathTransaction): void {
		tran.setFill(this.prop.color.getAlphaNumber(this.prop.alpha));
		// tran.setStrokeColor(0x00000000);
		// tran.setStrokeStyle(
		// 	this.prop.thickness
		// );
	}

	protected setCommitProperty(tran: PathTransaction): void {
	}

	setText(text: string): void {
		// 処理なし。
	}

	backward(): void {
		// 処理なし。
	}
}

