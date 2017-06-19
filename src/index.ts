import * as drawchat from "@s2study/draw-api";

import DrawHistory = drawchat.history.DrawHistory;
import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import {Editor} from "./Editor";
import {EditorProperties} from "./EditorProperties";
import {Updater} from "@s2study/draw-updater/lib/Updator";

export function createInstance(
	source: DrawHistory | Updater,
	renderer: DrawchatRenderer,
	properties?: EditorProperties): Editor {
	return new Editor(source, renderer, properties);
}
export default createInstance;

export interface DrawchatCanvas {
	touchStart(x: number, y: number): void;
	touchMove(x: number, y: number): void;
	touchEnd(x: number, y: number): void;
	setText(text: string): void;
	backward(): void;
}

/**
 * Color definition
 */
export interface Color {
	r: number;
	g: number;
	b: number;
	getNumber(): number;
	getAlphaNumber( alpha: number): number;
}

/**
 * Definition of properties to set in the editor.
 */
export interface DrawEditorProperties {

	/**
	 * Specify fill or stroke color
	 */
	color: Color;

	/**
	 *
	 */
	thickness: number;

	/**
	 * Specify font size in pixel value
	 */
	fontSize: number;

	/**
	 * Font family name
	 */
	fontFamily: string;

	/**
	 * Specify font thickness
	 */
	fontWeight: number;

	/**
	 * Designation of font style such as italic
	 */
	fontStyle: string;

	/**
	 * Specifying transparency
	 */
	alpha: number;

	/**
	 * Path types
	 * 0: moveTo <br />
	 * 1: arcTo <br />
	 * 2: quadraticCurveTo <br />
	 * 3: lineTo <br />
	 * 4: bezierCurveTo <br />
	 */
	pathType: number;
}

/**
 * プロパティ変更の通知を受け取るリスナーの定義
 */
export interface ChangePropertiesListener {
	( properties: DrawEditorProperties ): void;
}

export interface IEventListener<F extends Function> {
	on(listener: F): DrawEditorEventListeners;
	once(listener: F): DrawEditorEventListeners;
	off(listener: F): DrawEditorEventListeners;
}

/**
 * キャンバスの変更通知に関するアクセスを行うインターフェースの定義
 */
export interface Update extends IEventListener<UpdateListener> { }

/**
 * エディタイベントへのアクセスを行うインターフェス
 */
export interface DrawEditorEventListeners {

	/**
	 * プロパティ変更通知
	 */
	readonly changeProperties: ChangeProperties;

	/**
	 * 編集モード編集通知
	 */
	readonly changeMode: ModeChange;

	/**
	 * 編集レイヤー変更通知
	 */
	readonly changeCurrentLayer: ChangeCurrentLayer;

	/**
	 * 更新通知
	 */
	readonly update: Update;
}

// export interface DrawEditorModeChanger {
//
// 	/**
// 	 * モードチェンジ中
// 	 */
// 	readonly CHANGING: number;
//
// 	/**
// 	 * 消しゴムツールを示す定数
// 	 */
// 	readonly ERASER_MODE: number;
//
// 	/**
// 	 * 塗りツールを示す定数
// 	 */
// 	readonly FILL_MODE: number;
//
// 	/**
// 	 * 線ツールを示す定数
// 	 */
// 	readonly STROKE_MODE: number;
//
// 	/**
// 	 * クリップツールを示す定数
// 	 */
// 	readonly CLIP_MODE: number;
//
// 	/**
// 	 * テキストツールを示す定数
// 	 */
// 	readonly TEXT_MODE: number;
//
// 	/**
// 	 * 手のひらツールを示す定数
// 	 */
// 	readonly HAND_TOOL_MODE: number;
//
// 	/**
// 	 * スポイトツールを示す定数
// 	 */
// 	readonly EYEDROPPER_MODE: number;
//
// 	/**
// 	 * 現在のモードを取得する。
// 	 */
// 	getMode(): number;
//
// 	/**
// 	 * モード変更
// 	 */
// 	changeMode(mode: number): Promise<any>;
//
// 	isAliveMode(mode: Number): boolean;
// }
//
// export interface DrawEditorLayers {
//
// 	/**
// 	 * レイヤー数
// 	 */
// 	layerCount(): Promise<number>;
//
// 	/**
// 	 * レイヤー切り替え
// 	 * @param index
// 	 */
// 	setCurrent(index: number): Promise<any>;
//
// 	/**
// 	 * 現在レイヤー
// 	 */
// 	getCurrent(): Promise<number>;
//
// 	/**
// 	 * 指定レイヤーの表示
// 	 * @param index
// 	 */
// 	show(index: number): void;
//
// 	/**
// 	 * 指定レイヤーの非表示
// 	 * @param index
// 	 */
// 	hide(index: number): void;
//
// 	/**
// 	 * レイヤー全非表示
// 	 */
// 	hideAll(): void;
//
// 	/**
// 	 * レイヤーの全表示
// 	 */
// 	showAll(): void;
//
// 	/**
// 	 * レイヤーの削除
// 	 * @param index
// 	 */
// 	remove(index: number): Promise<any>;
//
// 	/**
// 	 *  レイヤーの追加
// 	 */
// 	addLayer(): Promise<any>;
//
// 	/**
// 	 * レイヤーの順序移動
// 	 * @param index
// 	 */
// 	moveTo(index: number): Promise<any>;
// }

export interface DrawEditorCanvas {

	/**
	 * MouseDownもしくはTouchStartイベントを通知する。
	 * Canvasの左上を0,0とした座標を設定する。
	 * @param x
	 * @param y
	 */
	touchStart(x: number, y: number): void;

	/**
	 * ドラッグもしくはTouchMoveイベントを通知する。
	 * @param x
	 * @param y
	 */
	touchMove(x: number, y: number): void;

	/**
	 * MouseUpもしくはTouchEndイベントを取得する。
	 * Canvasの左上を0,0とした座標を設定する。
	 * @param x
	 * @param y
	 */
	touchEnd(x: number, y: number): void;

	/**
	 * テキストを設定する。
	 * @param text
	 */
	setText(text: string): void;

	/**
	 * 座標設定の履歴を元に戻す。
	 */
	backward(): void;
}

/**
 * プロパティ変更通知に関するアクセスを行うインターフェースの定義
 */
export interface ChangeProperties extends IEventListener<ChangePropertiesListener> { }

/**
 * モード変更の通知を受け取るリスナーの定義
 */
export interface ModeChangeListener {
	( layerNumber: number ): void;
}
/**
 * モード変更通知に関するアクセスを行うインターフェースの定義
 */
export interface ModeChange extends IEventListener<ModeChangeListener> { }

/**
 * レイヤー変更の通知を受け取るリスナーの定義
 */
export interface ChangeCurrentLayerListener {
	( mode: number ): void;
}
/**
 * レイヤー変更通知に関するアクセスを行うインターフェースの定義
 */
export interface ChangeCurrentLayer extends IEventListener<ChangeCurrentLayerListener> { }

/**
 * キャンバスの変更通知を受け取るリスナーの定義
 */
export interface UpdateListener {
	(): void;
}
