import {EditorEventDispatchers} from "./EditorEventDispatchers";
import {Color} from "./index";
import {ColorFactory} from "./Color";

export class EditorProperties implements EditorProperties {

	private dispatcher: EditorEventDispatchers;

	/**
	 * 線の色
	 */
	_color: Color;
	get color(): Color {
		return this._color;
	}
	set color(val: Color) {
		this._color = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * 線の太さ
	 */
	_thickness: number;
	get thickness(): number {
		return this._thickness;
	}
	set thickness(val: number) {
		this._thickness = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * フォントサイズ
	 */
	_fontSize: number;
	get fontSize(): number {
		return this._fontSize;
	}
	set fontSize(val: number) {
		this._fontSize = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * フォントファミリー
	 */
	_fontFamily: string;
	get fontFamily(): string {
		return this._fontFamily;
	}
	set fontFamily(val: string) {
		this._fontFamily = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * フォントの太さ
	 */
	_fontWeight: number;
	get fontWeight(): number {
		return this._fontWeight;
	}
	set fontWeight(val: number) {
		this._fontWeight = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * フォントスタイル
	 */
	_fontStyle: string ;
	get fontStyle(): string {
		return this._fontStyle;
	}
	set fontStyle(val: string) {
		this._fontStyle = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * アルファ値
	 */
	_alpha: number;
	get alpha(): number {
		return this._alpha;
	}
	set alpha(val: number) {
		this._alpha = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * パスの種別
	 * 0: moveTo
	 * 1: arcTo
	 * 2: quadraticCurveTo
	 * 3: lineTo
	 * 4: bezierCurveTo
	 */
	_pathType: number;
	get pathType(): number {
		return this._pathType;
	}
	set pathType(val: number) {
		this._pathType = val;
		this.dispatcher.changeProperties.dispatch(this);
	}

	/**
	 * パス設定の精度。mouseMove時の距離判定で利用する。
	 * 1が初期値 これより高ければ短い距離でもプロットする。
	 */
	accuracy: number;

	constructor(
		dispatcher: EditorEventDispatchers,
		initProps?: EditorProperties
	) {
		this.dispatcher = dispatcher;
		if (initProps == null) {
			this.setDefault();
			return;
		}
		this._color = initProps.color;
		this._pathType = initProps.pathType;
		this._alpha = initProps.alpha;
		this._fontStyle = initProps.fontStyle;
		this._fontWeight = initProps.fontWeight;
		this._fontFamily = initProps.fontFamily;
		this._fontSize = initProps.fontSize;
		this._thickness = initProps.thickness;
		this.accuracy = initProps.accuracy;
	}

	private setDefault() {
		this._color = ColorFactory.createInstance();
		this._pathType = 0;
		this._alpha = 1.0;
		this._fontStyle = "normal";
		this._fontWeight = 400;
		this._fontFamily = "sans-serif";
		this._fontSize = 24;
		this._thickness = 12;
		this.accuracy = 1;
	}
}
