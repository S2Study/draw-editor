import {ItemFactory, Float32ItemArray} from "./FixSizeArray";
export interface Point {
	x: number;
	y: number;
}
class PointFactory implements ItemFactory<Point> {
	createInstance(index: number, typedArray: any): Point {
		return new PointImpl(typedArray, index);
	}
}

/**
 * Point の実装。
 * 内部的にTypedArrayを参照しており、
 * PointList上でRemoveされた場合の参照は残るためインスタンスの使い回しには注意する。
 */
class PointImpl implements Point {
	private array: Float32Array;
	private index: number;

	constructor(array: Float32Array,
				index: number) {
		this.array = array;
		this.index = index;

	}

	get x(): number {
		return this.array[2 * this.index];
	}

	set x(val: number) {
		this.array[2 * this.index] = val;
	}

	get y(): number {
		return this.array[2 * this.index + 1];
	}

	set y(val: number) {
		this.array[2 * this.index + 1] = val;
	}
}

/**
 * 固定長サイズのリスト
 */
export class PointList extends Float32ItemArray<Point> {

	constructor(size: number) {
		super(2, size, new PointFactory());
	}

	push(
		x: number = 0,
		y: number = 0): Point {
		if (this.len + 1 === this.max) {
			throw new Error("Array index out of range.");
		}
		this.list[this.len].x = x;
		this.list[this.len].y = y;
		this.len = (this.len + 1) | 0;
		return this.list[((this.len - 1) | 0)];
	}

	set(index: number, x: number, y: number): Point {
		if (index > this.len + 1) {
			throw new Error("Array index out of range.");
		}
		this.list[index].x = x;
		this.list[index].y = y;
		if (this.len === index) {
			this.len = index;
		}
		return this.list[index];
	}
}
