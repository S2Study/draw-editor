import * as api from "@s2study/draw-api";

import DrawHistory = api.history.DrawHistory;
import DrawchatRenderer = api.renderer.DrawchatRenderer;
import Message = api.structures.Message;

import * as emitter from "eventemitter3";
import {Layers} from "./Layers";
import {Changer} from "./Changer";
import {Updater} from "@s2study/draw-updater/lib/Updator";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";
import updaters from "@s2study/draw-updater";
import viewers from "@s2study/draw-viewer";

import {EditorProperties} from "./EditorProperties";
import {EditorEventListeners} from "./EditorEventListeners";
import {EditorEventDispatchers} from "./EditorEventDispatchers";
import {DrawchatCanvas} from "./index";

export class Editor {

	/**
	 * 設定値
	 */
	_properties: EditorProperties;

	/**
	 * モードチェンジャー
	 */
	_mode: Changer;

	layers: Layers;

	private history: DrawHistory;
	private updater: Updater;
	private renderer: DrawchatRenderer;
	private viewer: DrawViewer;
	private _listeners: EditorEventListeners;
	private _dispatchers: EditorEventDispatchers;

	constructor(
		source: DrawHistory | Updater,
		renderer: DrawchatRenderer,
		properties?: EditorProperties
	) {
		if ((<Updater>source).history !== null && (<Updater>source).history !== undefined) {
			this.updater = (<Updater>source);
			this.history = this.updater.history;
		} else {
			this.history = <DrawHistory>source;
			this.updater = updaters.createInstance(this.history);
		}

		this.renderer = renderer;
		this.viewer = viewers.createInstance(this.history, renderer);
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

	get properties(): EditorProperties {
		return this._properties;
	}

	get canvas(): DrawchatCanvas {
		return this._mode.canvas;
	}

	get mode(): Changer {
		return this._mode;
	}

	get events(): EditorEventListeners {
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
