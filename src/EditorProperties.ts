import drawchat from "@s2study/draw-api";

import DrawchatEditorProperties = drawchat.editor.DrawEditorProperties;
import Color = drawchat.editor.Color;
export class EditorProperties implements DrawchatEditorProperties {

	/**
	 * 線の色
	 */
	color: Color;

	/**
	 * 線の太さ
	 */
	thickness: number;

	/**
	 * フォントサイズ
	 */
	fontSize: number;

	/**
	 * フォントファミリー
	 */
	fontFamily: string;

	/**
	 * フォントの太さ
	 */
	fontWeight: number;

	/**
	 * フォントスタイル
	 */
	fontStyle: string;

	/**
	 * アルファ値
	 */
	alpha: number;

	/**
	 * パスの種別
	 * 0: moveTo
	 * 1: arcTo
	 * 2: quadraticCurveTo
	 * 3: lineTo
	 * 4: bezierCurveTo
	 */
	pathType: number;

	constructor() {
		this.color = new ColorImpl();
		this.pathType = 0;
		this.alpha = 1.0;
		this.fontStyle = null;
		this.fontWeight = 400;
		this.fontFamily = "sans-serif";
		this.fontSize = 24;
		this.thickness = 12;
	}
}
class ColorImpl implements Color {
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

	constructor(r: number = 0,
				g: number = 0,
				b: number = 0) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	static correctColor(color: number) {
		return !isNaN(color) || color < 0 ? 0 : (color > 255 ? 255 : color);
	}
}

