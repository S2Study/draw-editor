import {ItemFactory, Float32ItemArray} from "./FixSizeArray";

export interface Point {
	x: number;
	y: number;
}

export interface PointBrush extends Point {
	x: number;
	y: number;
	dis: number;
}

class PointFactory implements ItemFactory<Point> {
	createInstance(index: number, typedArray: any): Point {
		return new PointImpl(typedArray, index);
	}
}

class PointBrushFactory implements ItemFactory<PointBrush> {
	createInstance(index: number, typedArray: any): PointBrush {
		return new PointBrushImpl(typedArray, index);
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
 * PointBrush の実装。
 * 内部的にTypedArrayを参照しており、
 * PointList上でRemoveされた場合の参照は残るためインスタンスの使い回しには注意する。
 */
class PointBrushImpl implements PointBrush {

	private array: Float32Array;
	private index: number;

	constructor(array: Float32Array,
				index: number) {
		this.array = array;
		this.index = index;

	}

	get x(): number {
		return this.array[3 * this.index];
	}

	set x(val: number) {
		this.array[3 * this.index] = val;
	}

	get y(): number {
		return this.array[3 * this.index + 1];
	}

	set y(val: number) {
		this.array[3 * this.index + 1] = val;
	}

	get dis(): number {
		return this.array[3 * this.index + 2];
	}

	set dis(val: number) {
		this.array[3 * this.index + 2] = val;
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

	toString(): string {
		let size = this.size();
		let result = "[ ";
		for (let i = 0; i < size; i++) {
			let point = this.item(i);
			result += `{ x: ${point.x}, y: ${point.y} },`;
		}
		result += " ]";
		return result;
	}
}

export class PointBrushList extends Float32ItemArray<PointBrush> {

	constructor(size: number) {
		super(3, size, new PointBrushFactory());
	}

	push(
		x: number = 0,
		y: number = 0,
		dis: number = 0
	): PointBrush {

		if (this.len + 1 === this.max) {
			throw new Error("Array index out of range.");
		}
		const item = this.list[this.len];
		item.x = x;
		item.y = y;
		item.dis = dis;

		this.len = (this.len + 1) | 0;
		return this.list[((this.len - 1) | 0)];
	}

	set(
		index: number, x: number, y: number, dis: number
	): PointBrush {
		if (index > this.len + 1) {
			throw new Error("Array index out of range.");
		}

		const item = this.list[index];
		item.x = x;
		item.y = y;
		item.dis = dis;

		if (this.len === index) {
			this.len = index;
		}
		return this.list[index];
	}

	toString(): string {
		let size = this.size();
		let result = "[ ";
		for (let i = 0; i < size; i++) {
			let point = this.item(i);
			result += `{ x: ${point.x}, y: ${point.y} dis: ${point.dis} },`;
		}
		result += " ]";
		return result;
	}
}

