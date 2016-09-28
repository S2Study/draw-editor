import {ItemFactory, Float32ItemArray} from "./FixSizeArray";
import {PointList} from "./PointArray";
/**
 * ２次ベジェスプライン曲線をプロットするクラス
 * コードは以下のサイトから引用
 *
 * http://hakuhin.jp/as/curve.html#CURVE_04
 */
export class SplinePlotter {

	/**
	 * プロット数
	 */
	private optCount: number;

	//
	private _A: Float32ItemArray<Triple>;
	private _B: PointList;
	private _C: PointList;
	private l: Float32Array;
	private result: PointList;
	private input: PointList;

	constructor(// resultSize:number = 2000,
				cashSize: number = 1000,
				optCount: number = 20) {
		this.optCount = optCount | 0;
		this._A = new Float32ItemArray(
			3, cashSize, new TripleItemFactory()
		);
		this._B = new PointList(cashSize);
		this._C = new PointList(cashSize);
		this.l = new Float32Array(cashSize);
		this.result = new PointList(cashSize * optCount);
		this.input = new PointList(cashSize);
	}

	get resultList(): PointList {
		return this.result;
	}

	get inputList(): PointList {
		return this.input;
	}

	/**
	 * スプライン曲線描画用の座標を取得します。
	 */
	calc() {
		let num = this.input.size();

		let i: number = 0 | 0;
		let j = i | 0;

		while (j < ((num - 1) | 0)) {
			let p0 = this.input.item(i);
			let p1 = this.input.item(i + 1);

			let lenX = p0.x - p1.x;
			let lenY = p0.y - p1.y;

			j = (j + 1) | 0;
			if (lenX === 0 && lenY === 0) {
				this.input.remove(i);
				continue;
			}
			// this.l[i] = (lenX === 0 || lenY === 0) ? 0 : Math.sqrt(lenX * lenX + lenY * lenY);
			this.l[i] = Math.sqrt(lenX * lenX + lenY * lenY);
			i = (i + 1) | 0;
		}

		num = (i + 1) | 0;
		this._A.init(num);
		this._B.init(num);
		this._C.init(num);

		if (num <= 1) {
			this.result.init();
			return;
		}

		this._A.item(0).i1 = 0;
		this._A.item(0).i2 = 1;
		this._A.item(0).i3 = 0.5;

		this._B.set(
			0,
			(3 / (2 * this.l[0])) * this.convertNaN(this.input.item(1).x - this.input.item(0).x),
			(3 / (2 * this.l[0])) * this.convertNaN(this.input.item(1).y - this.input.item(0).y)
		);

		this._A.item(num - 1).i1 = 1;
		this._A.item(num - 1).i2 = 2;
		this._A.item(num - 1).i3 = 0;
		this._B.set(
			num - 1,
			(3 / (this.l[num - 2])) * this.convertNaN(this.input.item(num - 1).x - this.input.item(num - 2).x),
			(3 / (this.l[num - 2])) * this.convertNaN(this.input.item(num - 1).y - this.input.item(num - 2).y)
		);

		let a: number;

		i = 1 | 0;
		while (i < ((num - 1) | 0)) {
			a = this.l[i - 1];
			let b = this.l[i];

			this._A.item(i).i1 = b;
			this._A.item(i).i2 = 2.0 * (b + a);
			this._A.item(i).i3 = a;
			this._B.set(
				i,
				(3.0 * (a * a * (this.input.item(i + 1).x - this.input.item(i).x)) + 3.0 * b * b * (this.input.item(i).x - this.input.item(i - 1).x)) / this.convertNaN(b * a),
				(3.0 * (a * a * (this.input.item(i + 1).y - this.input.item(i).y)) + 3.0 * b * b * (this.input.item(i).y - this.input.item(i - 1).y)) / this.convertNaN(b * a)
			);
			i = (i + 1) | 0;
		}
		i = 1 | 0;
		while (i < ((num ) | 0)) {
			let d = this._A.item(i - 1).i2 / this._A.item(i).i1;

			this._A.item(i).i1 = 0;
			this._A.item(i).i2 = this._A.item(i).i2 * d - this._A.item(i - 1).i3;
			this._A.item(i).i3 = this._A.item(i).i3 * d;

			this._B.set(
				i,
				(this._B.item(i).x * d - this._B.item(i - 1).x) / this._A.item(i).i2,
				(this._B.item(i).y * d - this._B.item(i - 1).y) / this._A.item(i).i2
			);

			this._A.item(i).i3 = this._A.item(i).i3 / this._A.item(i).i2;
			this._A.item(i).i2 = 1;
			i = (i + 1) | 0;
		}

		this._C.set(
			num - 1,
			this._B.item(num - 1).x,
			this._B.item(num - 1).y
		);
		j = (num - 1) | 0;
		while (j > 0) {
			this._C.set(
				j - 1,
				this._B.item(j - 1).x - this._A.item(j - 1).i3 * this._C.item(j).x,
				this._B.item(j - 1).y - this._A.item(j - 1).i3 * this._C.item(j).y
			);
			j = (j - 1) | 0;
		}
		this.result.init(0);

		let _00: number;
		let _01: number;
		let _02: number;
		let _03: number;
		let _10: number;
		let _11: number;
		let _12: number;
		let _13: number;

		i = 0 | 0;
		while (i < ((num - 1) | 0)) {
			a = this.l[i];
			_00 = this.input.item(i).x;
			_01 = this._C.item(i).x;
			_02 = (this.input.item(i + 1).x - this.input.item(i).x) * 3 / (a * a)
				- (this._C.item(i + 1).x + 2 * this._C.item(i).x) / a;

			_03 = (this.input.item(i + 1).x - this.input.item(i).x) * (-2 / (a * a * a))
				+ (this._C.item(i + 1).x + this._C.item(i).x) * (1 / (a * a));
			_10 = this.input.item(i).y;

			_11 = this._C.item(i).y;

			_12 = (this.input.item(i + 1).y - this.input.item(i).y) * 3 / (a * a)
				- (this._C.item(i + 1).y + 2 * this._C.item(i).y) / a;
			_13 = (this.input.item(i + 1).y - this.input.item(i).y) * (-2 / (a * a * a))
				+ (this._C.item(i + 1).y + this._C.item(i).y) * (1 / (a * a));

			let t = 0;
			j = 0 | 0;
			while (j < this.optCount) {
				this.result.push(
					((_03 * t + _02) * t + _01) * t + _00,
					((_13 * t + _12) * t + _11) * t + _10
				);
				t += a / this.optCount;
				j = (j + 1) | 0;
			}
			i = (i + 1) | 0;
		}
		this.result.push(
			this.input.item(num - 1).x,
			this.input.item(num - 1).y
		);
	}

	private convertNaN(num: number): number {
		return num === 0 ? 0.001 : num;
	}
}

class TripleItemFactory implements ItemFactory<Triple> {
	createInstance(index: number, typedArray: any): Triple {
		return new Triple(typedArray, index);
	}
}

/**
 * Point の実装。
 * 内部的にTypedArrayを参照しており、
 * PointList上でRemoveされた場合の参照は残るためインスタンスの使い回しには注意する。
 */
class Triple {
	private array: Float32Array;
	private index: number;

	constructor(array: Float32Array,
				index: number) {
		this.array = array;
		this.index = index;

	}

	get i1(): number {
		return this.array[3 * this.index];
	}

	set i1(val: number) {
		this.array[3 * this.index] = val;
	}

	get i2(): number {
		return this.array[3 * this.index + 1];
	}

	set i2(val: number) {
		this.array[3 * this.index + 1] = val;
	}

	get i3(): number {
		return this.array[3 * this.index + 2];
	}

	set i3(val: number) {
		this.array[3 * this.index + 2] = val;
	}
}
