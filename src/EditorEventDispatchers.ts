import * as api from "@s2study/draw-api";
import DrawEditorProperties = api.editor.DrawEditorProperties;
import ChangeProperties = api.editor.ChangeProperties;
import * as emitter from "eventemitter3";
import {
	EVENT_CHANGE_PROPERTIES, EVENT_CHANGE_MODE, EVENT_CHANGE_CURRENT_LAYER,
	EVENT_UPDATE
} from "./EditorEventListeners";
import {EditorProperties} from "./EditorProperties";

export class EditorEventDispatchers {

	private _changeProperties: EventDispatcher<EditorProperties>;
	get changeProperties(): EventDispatcher<EditorProperties>{
		return this._changeProperties;
	}

	private _changeMode: EventDispatcher<number>;
	get changeMode(): EventDispatcher<number> {
		return this._changeMode;
	}

	private _changeCurrentLayer: EventDispatcher<number>;
	get changeCurrentLayer(): EventDispatcher<number> {
		return this._changeCurrentLayer;
	}

	private _update: EventDispatcher<any>;
	get update(): EventDispatcher<any> {
		return this._update;
	}

	constructor(eventEmitter: emitter.EventEmitter) {
		this._changeProperties = new EventDispatcher(
			eventEmitter,
			EVENT_CHANGE_PROPERTIES
		);
		this._changeMode = new EventDispatcher(
			eventEmitter,
			EVENT_CHANGE_MODE
		);
		this._changeCurrentLayer = new EventDispatcher(
			eventEmitter,
			EVENT_CHANGE_CURRENT_LAYER
		);
		this._update = new EventDispatcher(
			eventEmitter,
			EVENT_UPDATE
		);
	}
}

export class EventDispatcher<V> {

	private eventName: string;
	private emitter3: emitter.EventEmitter;

	constructor(
		emitter3: emitter.EventEmitter,
		eventName: string
	) {
		this.eventName = eventName;
		this.emitter3 = emitter3;
	}

	dispatch(val: V): void {
		this.emitter3.emit(this.eventName, val);
	}
}
