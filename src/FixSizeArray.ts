export abstract class FixSizeArray<I> {

	protected len: number;
	protected list: I[];
	protected _max: number;

	constructor(list: I[]) {
		this.list = list;
		this._max = list.length;
		this.len = 0;
	}

	remove(index: number): void {
		if (index < 0 || index >= this.len) {
			return;
		}
		let removed = this.list[index];
		this.len = (this.len - 1) | 0;
		let i = ( index + 1 ) | 0;
		while (i < this._max) {
			this.list[i - 1] = this.list[i];
			i = (i + 1) | 0;
		}
		this.list[i - 1] = removed;
	}

	init(size: number = 0): void {
		this.len = size;
	}

	item(index: number): I {
		return this.list[index];
	}

	size(): number {
		return this.len;
	}

	get max(): number {
		return this._max;
	}
}
export class Float32ItemArray<I> extends FixSizeArray<I> {
	constructor(itemSize: number, listSize: number, factory: ItemFactory<I>) {
		let array = new Float32Array(itemSize * listSize);
		let i = 0 | 0;
		let list: I[] = [];
		while (i < listSize) {
			list.push(factory.createInstance(i, array));
			i = (i + 1) | 0;
		}
		super(list);
	}
}
export interface ItemFactory<I> {
	createInstance(index: number, typedArray: any): I;
}
