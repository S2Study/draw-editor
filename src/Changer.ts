import drawchat from "@s2study/draw-api";

import DrawchatModeChanger = drawchat.editor.DrawEditorModeChanger;
import DrawchatUpdater = drawchat.updater.DrawchatUpdater;
import DrawchatCanvas = drawchat.editor.DrawEditorCanvas;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import {Layers} from "./Layers";
import {ModeEraser} from "./ModeEraser";
import {EditorProperties} from "./EditorProperties";
import {ModeFill} from "./ModeFill";
import {ModeStroke} from "./ModeStroke";
import {ModeClip} from "./ModeClip";
import {ModeText} from "./ModeText";
import {ModeHandTool} from "./ModeHandTool";
import {ModeEyedropper} from "./ModeEyedropper";
import {ModeChanging} from "./ModeChanging";
export class Changer implements DrawchatModeChanger {

	private static EMPTY_CANVAS = new ModeChanging();

	/**
	 * モードチェンジ中
	 */
	get CHANGING(): number {
		return CHANGING;
	}

	/**
	 * 消しゴムツールを示す定数
	 */
	get ERASER_MODE(): number {
		return ERASER_MODE;
	}

	/**
	 * 塗りツールを示す定数
	 */
	get FILL_MODE(): number {
		return FILL_MODE;
	}

	/**
	 * 線ツールを示す定数
	 */
	get STROKE_MODE(): number {
		return STROKE_MODE;
	}

	/**
	 * クリップツールを示す定数
	 */
	get CLIP_MODE(): number {
		return CLIP_MODE;
	}

	/**
	 * テキストツールを示す定数
	 */
	get TEXT_MODE(): number {
		return TEXT_MODE;
	}

	/**
	 * 変形ツールを示す定数
	 */
	get HAND_TOOL_MODE(): number {
		return TRANSFORM_MODE;
	}

	/**
	 * スポイトツールを示す定数
	 */
	get EYEDROPPER_MODE(): number {
		return EYEDROPPER_MODE;
	}

	private updater: DrawchatUpdater;

	private layers: Layers;

	private prop: EditorProperties;

	private viewer: DrawchatViewer;

	constructor(layers: Layers,
				prop: EditorProperties) {
		this.updater = layers.updater;
		this.prop = prop;
		this.viewer = layers.viewer;
		this.layers = layers;
		this.canvas = Changer.EMPTY_CANVAS;
		this.mode = -1;
	}

	private mode: number;

	private reservedMode: number;

	canvas: DrawchatCanvas;

	getMode(): number {
		return this.mode;
	}

	changeMode(mode: number): Promise<any> {
		this.mode = this.CHANGING;
		this.reservedMode = mode;
		this.canvas = Changer.EMPTY_CANVAS;
		let currentId = this.layers.currentId;

		switch (mode) {
			case this.ERASER_MODE:
				return this.updater.beginPath(currentId).then((tran) => {
					return this.doChangeMode(this.ERASER_MODE, new ModeEraser(this.viewer, tran, this.prop));
				});
			case this.FILL_MODE:
				return this.updater.beginPath(currentId).then((tran) => {
					return this.doChangeMode(this.FILL_MODE, new ModeFill(this.viewer, tran, this.prop));
				});
			case this.STROKE_MODE:
				return this.updater.beginPath(currentId).then((tran) => {
					return this.doChangeMode(this.STROKE_MODE, new ModeStroke(this.viewer, tran, this.prop));
				});
			case this.CLIP_MODE:
				return this.updater.beginClip(currentId).then((tran) => {
					return this.doChangeMode(this.CLIP_MODE, new ModeClip(this.viewer, tran, this.prop));
				});
			case this.TEXT_MODE:
				return this.updater.beginText(currentId).then((tran) => {
					return this.doChangeMode(this.TEXT_MODE, new ModeText(this.viewer, tran, this.prop));
				});
			case this.HAND_TOOL_MODE:
				return this.updater.beginTransform(currentId).then((tran) => {
					return this.doChangeMode(this.HAND_TOOL_MODE, new ModeHandTool(tran));
				});
			case this.EYEDROPPER_MODE:
				return this.layers.getCurrent()
					.then((current) => {
						return Promise.resolve(this.doChangeMode(this.EYEDROPPER_MODE, new ModeEyedropper(
							current,
							this.viewer,
							this.prop
						)));
					});

			default:
				break;
		}
		return Promise.resolve(null);
	}

	isAliveMode(mode: Number): boolean {
		switch (mode) {
			case this.ERASER_MODE:
			case this.FILL_MODE:
			case this.STROKE_MODE:
			case this.CLIP_MODE:
			case this.TEXT_MODE:
			case this.HAND_TOOL_MODE:
			case this.EYEDROPPER_MODE:
				return true;
			default:
				return false;
		}
	}

	private doChangeMode(mode: number, canvas: DrawchatCanvas): DrawchatCanvas {
		if (this.reservedMode !== mode) {
			return null;
		}
		this.mode = mode;
		this.canvas = canvas;
		return this.canvas;
	}

// changeMode(mode:number):void {
	// 	this.mode = mode;
	// }
}

const ERASER_MODE: number = 0;
const FILL_MODE: number = 1;
const STROKE_MODE: number = 2;
const CLIP_MODE: number = 3;
const TEXT_MODE: number = 4;
const TRANSFORM_MODE: number = 5;
const EYEDROPPER_MODE: number = 6;
const CHANGING: number = 7;
