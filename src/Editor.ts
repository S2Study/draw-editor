import * as api from "@s2study/draw-api";

import DrawchatEditor = api.editor.DrawEditor;
import DrawchatEditorProperties = api.editor.DrawEditorProperties;
import DrawchatCanvas = api.editor.DrawEditorCanvas;
import DrawchatModeChanger = api.editor.DrawEditorModeChanger;
import DrawchatUpdater = api.updater.DrawchatUpdater;
import DrawHistory = api.history.DrawHistory;
import UpdateListener = api.editor.UpdateListener;
import DrawchatRenderer = api.renderer.DrawchatRenderer;
import DrawchatViewer = api.viewer.DrawchatViewer;
import DrawEditorEventListeners = api.editor.DrawEditorEventListeners;
import Message = api.structures.Message;

import * as emitter from "eventemitter3";
import {Layers} from "./Layers";
import {Changer} from "./Changer";
import Updater from "@s2study/draw-updater";
import Viewer from "@s2study/draw-viewer";
import {EditorProperties} from "./EditorProperties";
import {EditorEventListeners} from "./EditorEventListeners";
import {EditorEventDispatchers} from "./EditorEventDispatchers";
export class Editor implements DrawchatEditor {

	/**
	 * 設定値
	 */
	_properties: EditorProperties;

	/**
	 * モードチェンジャー
	 */
	_mode: Changer;

	layers: Layers;

	// private listeners: Set<UpdateListener>;
	private history: DrawHistory;
	private updater: DrawchatUpdater;
	private renderer: DrawchatRenderer;
	private viewer: DrawchatViewer;
	private _listeners: EditorEventListeners;
	private _dispatchers: EditorEventDispatchers;

	constructor(
		history: DrawHistory,
		renderer: DrawchatRenderer,
		properties?: DrawchatEditorProperties
	) {
		// this.listeners = new Set<UpdateListener>();
		this.history = history;
		this.updater = Updater.createInstance(history);
		this.renderer = renderer;
		this.viewer = Viewer.createInstance(history, renderer);
		const emitter3 = new emitter.EventEmitter();
		this._dispatchers = new EditorEventDispatchers(emitter3);
		this.layers = new Layers(
			this.updater, this.viewer, this, this._dispatchers
		);
		this._properties = new EditorProperties(
			this._dispatchers, properties
		);

		this._mode = new Changer(
			this.layers,
			this._properties,
			this._dispatchers
		);

		this._listeners = new EditorEventListeners(emitter3);
	}

	get properties(): DrawchatEditorProperties {
		return this._properties;
	}

	get canvas(): DrawchatCanvas {
		return this._mode.canvas;
	}

	get mode(): DrawchatModeChanger {
		return this._mode;
	}

	get events(): DrawEditorEventListeners {
		return this._listeners;
	}

	get dispatchers(): EditorEventDispatchers {
		return this._dispatchers;
	}

	stop(): void {
		this.viewer.stop();
	}

	start(): void {
		this.viewer.start();
	}

	getWidth(): number {
		return this.renderer.width;
	}

	getHeight(): number {
		return this.renderer.height;
	}

	undo(): Promise<any> {
		let mode = this.mode.getMode();
		return this.updater.undo().then(() => {
			return this.mode.changeMode(mode);
		});
	}

	redo(): Promise<any> {
		let mode = this.mode.getMode();
		return this.updater.redo().then(() => {
			return this.mode.changeMode(mode);
		});
	}

	canUndo(): boolean {
		return this.updater.canUndo();
	}

	canRedo(): boolean {
		return this.updater.canRedo();
	}

	reRender(): void {
		this.viewer.refresh();
	}
	private setupListener(): void {
		this.history.awaitUpdate(() => {
			try {
				this._dispatchers.update.dispatch(null);
			} catch (e) {
				console.warn(e);
			}
			this.setupListener();
		});
	}

	createImageURI(): Promise<string> {
		return Promise.resolve(this.viewer.createImageDataURI());
	}

	generateMessage(): Promise<Message> {
		return Promise.resolve(this.history.generateMessage());
	}
}
