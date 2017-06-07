import {EditorProperties} from "./EditorProperties";
import {SplinePlotter} from "./SplinePlotter";
import {Point, PointList} from "./PointArray";
import {IPathTransaction} from "@s2study/draw-updater/lib";
export class BrushDrawer {

	// /**
	//  * プロット数が多くなるので、使い回す。
	//  */
	// private static SPLINE: SplinePlotter = new SplinePlotter();

	private tran: IPathTransaction;
	private prop: EditorProperties;
	private input: PointList;
	private goList: PointList;
	private reList: PointList;

	constructor(
		tran: IPathTransaction,
		prop: EditorProperties
	) {
		this.tran = tran;
		// this.tran.setSavePoint();
		this.prop = prop;
		if (this.tran.isAlive()) {
			this.input.init();
		}
	}

	pop(): Point | null {
		if (this.tran.isAlive()) {
			this.input.init();
		}
		if (this.input.size() === 0) {
			return null;
		}
		let index = (this.input.size() - 1) | 0;
		let point: Point = {
			x: this.input.item(index).x,
			y: this.input.item(index).y
		};
		this.input.remove(index);
		return point;
	}

	clear(): BrushDrawer {
		if (this.tran.isAlive()) {
			this.input.init();
		}
		return this;
	}

	push(x: number, y: number): BrushDrawer {
		this.checkList();
		if (this.input.size() === 0) {
			this.input.push(x, y);
			return this;
		}
		let point = this.input.item(
			this.input.item.length - 1
		);
		if (point.x === x && point.y === y) {
			return this;
		}
		this.input.push(x, y);
		return this;
	}

	doPlot(closePath: boolean = false, circle: boolean = true): BrushDrawer {

		let size: number = this.input.size();

		if (size === 0) {
			return this;
		}

		if (size === 1 && circle) {
			this.firstCircle();
			return this;
		}

		if (closePath) {
			PathDrawer.SPLINE.inputList.push(
				PathDrawer.SPLINE.inputList.item(0).x,
				PathDrawer.SPLINE.inputList.item(0).y
			);
		}
		let addClose = size !== PathDrawer.SPLINE.inputList.size();

		PathDrawer.SPLINE.calc();
		let result = PathDrawer.SPLINE.resultList;
		// let result = PathDrawer.SPLINE.inputList;
		this.tran.moveTo(
			result.item(0).x,
			result.item(0).y
		);

		let i = 1 | 0;
		while (i < result.size()) {
			this.tran.lineTo(
				result.item(i).x,
				result.item(i).y
			);
			i = (i + 1) | 0;
		}
		// console.log('パス描画 : '  + i);
		if (addClose) {
			PathDrawer.SPLINE.inputList.remove(PathDrawer.SPLINE.inputList.size() - 1);
		}
		return this;
	}

	private getRadian(degrees: number): number {
		return degrees * Math.PI / 180;
	}

	/**
	 * 円弧を描く
	 */
	private firstCircle() {

		const kappa = 0.5522848;
		let radius = this.prop.thickness ? this.prop.thickness : 1;
		const o = radius * kappa;
		let x = this.input.item(0).x;
		let y = this.input.item(0).y;

		this.tran.moveTo(
			x - radius * Math.cos(0),
			y - radius * Math.sin(0)
		);

		for (let i = 1; i <= 4; i++) {
			let deg = i * 90;
			this.tran.bezierCurveTo(
				x + o * Math.cos(this.getRadian(deg - 90)),
				y + o * Math.sin(this.getRadian(deg - 90)),
				x + o * Math.cos(this.getRadian(deg + 90)),
				y + o * Math.sin(this.getRadian(deg + 90)),
				x - radius * Math.cos(this.getRadian(deg)),
				y - radius * Math.sin(this.getRadian(deg))
			);
		}
	}

	/**
	 * リストの大きさを計算してポイントの間引きを実施
	 */
	private checkList(): void {
		if (PathDrawer.SPLINE.inputList.size() + 1 === PathDrawer.SPLINE.inputList.max) {
			this.cullList();
		}
	}

	/**
	 * リストポイントの間引きを実施
	 */
	private cullList(): void {
		let len = PathDrawer.SPLINE.inputList.max;
		let i = len - 1;
		while (i >= 0) {
			if (i % 4 === 1) {
				PathDrawer.SPLINE.inputList.remove(i);
			}
			i = (i - 1) | 0;
		}
	}
}

