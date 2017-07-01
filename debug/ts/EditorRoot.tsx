import * as React from "react";
import * as styles from "./EditorRootStyle.scss";
import Renderer from "@s2study/draw-canvas2d-renderer";
import * as editors from "../../src/index";
import {history, renderer} from "@s2study/draw-api";
import DrawHistory = history.DrawHistory;
import DrawchatRenderer = renderer.DrawchatRenderer;
import {Editor} from "../../src/Editor";
import {Color} from "../../src/index";
import {ColorFactory} from "../../src/Color";
import {EditorMain} from "./EditorMain";
import {CanvasContainer} from "./CanvasContainer";

export class EditorRootState {
	editor: Editor;
	// colors: Color[];
	latest: number;
	currentLayer: number = -1;
	layerCount: number = 0;
	modeChangeFirst: boolean = true;
	canvasId: string;

	constructor(
		editor: Editor,
		canvasId: string
	) {
		this.editor = editor;
		this.canvasId = canvasId;
		this.latest = -1;
		// this.colors = [
		// 	ColorFactory.createInstance(0, 0, 0),
		// 	ColorFactory.createInstance(255, 255, 0),
		// 	ColorFactory.createInstance(255, 0, 255),
		// 	ColorFactory.createInstance(0, 255, 255),
		// ];
		// this.modeItems = [
		// 	new ModeItem(editor.mode.STROKE_MODE, 1),
		// 	new ModeItem(editor.mode.STROKE_MODE, 12),
		// 	new ModeItem(editor.mode.STROKE_MODE, 24),
		// 	// new ModeItem(editor.mode.FILL_MODE),
		// 	new ModeItem(editor.mode.HAND_TOOL_MODE),
		// 	// new ModeItem(editor.mode.TEXT_MODE),
		// 	// new ModeItem(editor.mode.CLIP_MODE),
		// 	new ModeItem(editor.mode.EYEDROPPER_MODE),
		// 	new ModeItem(editor.mode.ERASER_MODE, 24),
		// ];
	}
}

export interface EditorRootProps {
	history: DrawHistory;
	canvasElement?: string;
	canvasWidth?: number;
	canvasHeight?: number;
}

export class EditorRoot extends React.Component<EditorRootProps, EditorRootState> {

	constructor(props: EditorRootProps) {
		super(props);
		const canvasId = props.canvasElement == null ? "editorCanvas" : props.canvasElement;

		const renderer: DrawchatRenderer = Renderer.createDOMRenderer(
			canvasId,
			props.canvasWidth == null ? 1000 : props.canvasWidth,
			props.canvasHeight == null ? 800 : props.canvasHeight,
			200,
			200
		) as DrawchatRenderer;

		this.state = new EditorRootState(editors.createInstance(
			props.history,
			renderer
		), canvasId);
	}

	/**
	 * プロパティの補完
	 * @returns {boolean}
	 */
	private async complementProps(): Promise<boolean> {
		let layers = this.state.editor.layers;

		const count = await layers.layerCount();
		const current = await layers.getCurrent();

		const _state: EditorRootState = this.state;
		_state.layerCount = count;
		_state.currentLayer = current;

		if (count === 0) {
			await layers.addLayer();
			this.refresh();
			return true;
		}

		if (count >= 0 && current >= 0 && current < count) {
			_state.latest = current;
			return this.complementMode();
		}

		if (_state.latest >= 0 && _state.latest < count) {
			await layers.setCurrent(_state.latest);
			this.refresh();
			return true;
		}
		_state.latest = count - 1;

		await layers.setCurrent(count - 1);
		this.refresh();
		return true;
	}

	private complementMode(): boolean {

		const _state: EditorRootState = this.state;
		let mode = _state.editor.mode.getMode();
		if (
			(mode >= 0 && mode !== _state.editor.mode.CHANGING)
			|| (mode === _state.editor.mode.CHANGING && !_state.modeChangeFirst)
		) {
			return false;
		}

		_state.modeChangeFirst = false;
		const changer = _state.editor.mode;
		changer.changeMode(changer.BRUSH_MODE).then(() => {
			_state.editor.properties.thickness = 3;
			this.refresh();
		});
		return true;
	}

	/**
	 * 画面リフレッシュ
	 */
	refresh(): void {
		this.complementProps().then((doing) => {
			if (!doing) {
				this.setState(this.state);
			}
		});
	}

	/**
	 * コンポーネントマウント時の処理
	 */
	componentDidMount(): void {
		this.complementProps().then(() => {
			return null;
		});
	}

	// modeSelect(index: number): void {
	//
	// 	const _state: EditorRootState = this.state;
	// 	_state.modeItems = _state.modeItems.map((item, i) => {
	// 		return new ModeItem(item.mode, item.thickness, i === index);
	// 	});
	// 	let selected = _state.modeItems[index];
	// 	_state.editor.mode.changeMode(selected.mode).then(() => {
	// 		_state.editor.properties.thickness = selected.thickness;
	// 		this.refresh();
	// 	});
	// }

	render() {

		const _state: EditorRootState = this.state;
		return (
			<div style={{
				width: 1000,
				height: 800
			}} className={styles.container}>
				<div className={styles.canvasContainer}>
					<CanvasContainer id={_state.canvasId} editor={_state.editor} dx={200} dy={200} />
				</div>
				<div className={styles.canvasContainer}>
					<EditorMain id={_state.canvasId + "_eventLayer"} editor={_state.editor} dx={200} dy={200} />
				</div>
			</div>
		);
	}
}
