import {Color} from "./index";
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";

export class ColorImpl implements Color {

	_r: number;
	set r(val: number) {
		this._r = ColorImpl.correctColor(val);
	}

	get r(): number {
		return this._r;
	}

	_g: number;
	set g(val: number) {
		this._g = ColorImpl.correctColor(val);
	}

	get g(): number {
		return this._g;
	}

	_b: number;
	set b(val: number) {
		this._b = ColorImpl.correctColor(val);
	}

	get b(): number {
		return this._b;
	}

	constructor(
		r: number,
		g: number,
		b: number
	) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	getNumber(): number {
		return ( this.r << 16 ) + ( this.g << 8 )  + this.b;
	}

	getAlphaNumber(alpha: number): number {
		return ( this.r << 24 ) + ( this.g << 16 )  + ( this.b << 8) + alpha;
	}

	static correctColor(color?: number | null): number {
		return ( !DrawAPIUtils.isRational(color) || color! < 0 ) ? 0 : (color! > 255 ? 255 : color!);
	}
}
export class ColorFactoryStatic {

	createInstance(
		r?: number | null,
		g?: number | null,
		b?: number | null
	): Color {
		return new ColorImpl(
			ColorImpl.correctColor(r),
			ColorImpl.correctColor(g),
			ColorImpl.correctColor(b),
		);
	}
}
export const ColorFactory: ColorFactoryStatic = new ColorFactoryStatic();
