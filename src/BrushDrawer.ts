import {EditorProperties} from "./EditorProperties";
import {Point, PointBrush, PointBrushList, PointList} from "./PointArray";
import {IPathTransaction} from "@s2study/draw-updater/lib";

export class BrushDrawer {

	private tran: IPathTransaction;
	private prop: EditorProperties;

	constructor(
		tran: IPathTransaction,
		prop: EditorProperties,
		private input: PointBrushList,
		private goList: PointList,
		private reList: PointList
	) {
		this.tran = tran;
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

	push(x: number, y: number, dis: number): BrushDrawer {
		this.checkList();

		if (isNaN(dis)) {
			console.log("nan");
		}

		if (this.input.size() === 0) {
			this.input.push(x, y, dis);
			return this;
		}
		let point = this.input.item(
			this.input.item.length - 1
		);
		if (point.x === x && point.y === y) {
			return this;
		}
		this.input.push(x, y, dis);
		return this;
	}

	doPlot(
		circle: boolean = true
	): BrushDrawer {

		let size: number = this.input.size();
		if (size === 0) {
			return this;
		}

		if (size === 1) {
			if ( circle ) {
				this.firstCircle();
			}
			return this;
		}

		this.goList.init();
		this.reList.init();

		let max = ( this.input.size() - 1) | 0;
		let i = 1 | 0;

		let before = this.input.item(0);
		let now = this.input.item(1);

		this.putSame(before, BrushDrawer.rad(now, before));
		let after: PointBrush;

		if (i < max) {
			while (i < max) {

				after = this.input.item(i + 1);
				this.putPoint(now, BrushDrawer.radM(before, now, after));

				before = now;
				now = after;
				i = ( i + 1 ) | 0;
			}
		} else {

			const middle = {
				x: ( before.x + now.x ) / 2,
				y: ( before.y + now.y ) / 2,
				dis: ( before.dis + now.dis ) / 2,
			};

			this.putPoint(
				middle,
				BrushDrawer.radM(
					before, middle, now
			));
		}

		this.putSame(now, BrushDrawer.rad(before, now));

		console.log(this.input.toString());
		console.log(this.goList.toString());
		console.log(this.reList.toString());

		max = ( this.goList.size() - 1 ) | 0;
		let point: Point = this.goList.item(0);
		this.tran.moveTo(point.x, point.y);

		point = this.goList.item(1);
		let next: Point;

		i = 1 | 0;
		while (i < max) {

			next = this.goList.item(i + 1);
			if (i === max - 1) {
				this.tran.quadraticCurveTo(
					point.x,
					point.y,
					next.x,
					next.y
				);
				// console.log(`${point.x},${point.y},${next.x},${next.y}` );
			} else {
				this.tran.quadraticCurveTo(
					point.x,
					point.y,
					( point.x + next.x ) / 2,
					( point.y + next.y ) / 2
				);
				// console.log(`${point.x},${point.y},${( point.x + next.x ) / 2},${( point.y + next.y ) / 2}` );
			}
			point = next;
			i = ( i + 1 ) | 0;
		}

		i = ( max - 1 ) | 0;
		// point = this.reList.item(max);
		// this.tran.moveTo(point.x, point.y);
		point = this.reList.item(i);

		while (i > 0) {

			next = this.reList.item(i - 1);
			if (i === 1) {
				this.tran.quadraticCurveTo(
					point.x,
					point.y,
					next.x,
					next.y
				);
				// console.log(`${point.x},${point.y},${next.x},${next.y}` );
			} else {
				this.tran.quadraticCurveTo(
					point.x,
					point.y,
					( point.x + next.x ) / 2,
					( point.y + next.y ) / 2
				);
				// console.log(`${point.x},${point.y},${( point.x + next.x ) / 2},${( point.y + next.y ) / 2}` );
			}
			point = next;
			i = ( i - 1 ) | 0;
		}
		return this;
	}

	private putSame(
		now: PointBrush,
		rad: number
	): void {
		const goItem = this.goList.push();
		BrushDrawer.translate(
			now, goItem, rad, now.dis
		);

		const reItem = this.reList.push();
		BrushDrawer.translate(
			now, reItem, rad, now.dis
		);
	}

	private static readonly REVERSE: number = 180 * Math.PI / 180;

	private putPoint(
		now: PointBrush,
		rad: number
	): void {

		const goItem = this.goList.push();
		BrushDrawer.translate(
			now, goItem, rad, now.dis
		);
		const reItem = this.reList.push();
		console.log("angle:" + rad * 180 / Math.PI);

		BrushDrawer.translate(
			now, reItem, rad + BrushDrawer.REVERSE, now.dis
		);
	}

	private static getRadian(degrees: number): number {
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
				x + o * Math.cos(BrushDrawer.getRadian(deg - 90)),
				y + o * Math.sin(BrushDrawer.getRadian(deg - 90)),
				x + o * Math.cos(BrushDrawer.getRadian(deg + 90)),
				y + o * Math.sin(BrushDrawer.getRadian(deg + 90)),
				x - radius * Math.cos(BrushDrawer.getRadian(deg)),
				y - radius * Math.sin(BrushDrawer.getRadian(deg))
			);
		}
	}

	private static translate(
		input: Point,
		output: Point,
		rad: number,
		dis: number
	): void {
		output.x = ( input.x + Math.cos(rad) * dis + 0.5 ) | 0;
		output.y = ( input.y + Math.sin(rad) * dis + 0.5 ) | 0;
	}

	private static radM(a: Point, b: Point, c: Point): number {

		const rad1 = BrushDrawer.rad(a, c);
		const rad2 = (BrushDrawer.rad(b, a) + BrushDrawer.rad(b, c)) / 2;

		let diff = rad1 - rad2;
		if (diff < 0) {
			diff += Math.PI * 2;
		} else if (diff > Math.PI * 2) {
			diff -= Math.PI * 2;
		}
		if (diff < Math.PI) {
			return rad2;
		} else {
			return rad2 + Math.PI;
		}
		// return (BrushDrawer.rad(b, a) + BrushDrawer.rad(b, c)) / 2;
	}

	private static rad(a: Point, b: Point): number {
		return Math.atan2(b.y - a.y, b.x - a.x);
	}


	// private static angle(a: Point, b: Point): number {
	// 	let r = Math.atan2(b.y - a.y, b.x - a.x);
	// 	if ( r < 0 ) {
	// 		r = r + 2 * Math.PI;
	// 	}
	// 	return floor(r * 360 / (2 * Math.PI));
	// }

	/**
	 * リストの大きさを計算してポイントの間引きを実施
	 */
	private checkList(): void {
		if (this.input.size() + 1 === this.input.max) {
			this.cullList();
		}
	}

	/**
	 * リストポイントの間引きを実施
	 */
	private cullList(): void {
		let len = this.input.max;
		let i = len - 1;
		while (i >= 0) {
			if (i % 4 === 1) {
				this.input.remove(i);
			}
			i = (i - 1) | 0;
		}
	}
}

