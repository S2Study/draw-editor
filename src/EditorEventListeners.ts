import * as emitter from "eventemitter3";
import {
	ChangeCurrentLayer,
	ChangeCurrentLayerListener, ChangeProperties, ChangePropertiesListener, DrawEditorEventListeners, IEventListener,
	ModeChange,
	ModeChangeListener, Update, UpdateListener
} from "./index";

export const EVENT_CHANGE_PROPERTIES: string = "changeProperties";
export const EVENT_CHANGE_MODE: string = "changeMode";
export const EVENT_CHANGE_CURRENT_LAYER: string = "changeCurrentLayer";
export const EVENT_UPDATE: string = "update";

export class EditorEventListeners implements DrawEditorEventListeners {

	private _changeProperties: EventListenerImpl<ChangePropertiesListener>;
	private _changeMode: EventListenerImpl<ModeChangeListener>;
	private _changeCurrentLayer: EventListenerImpl<ChangeCurrentLayerListener>;
	private _update: EventListenerImpl<UpdateListener>;

	constructor(eventEmitter: emitter.EventEmitter) {
		this._changeProperties = new EventListenerImpl(
			this,
			eventEmitter,
			EVENT_CHANGE_PROPERTIES
		);
		this._changeMode = new EventListenerImpl(
			this,
			eventEmitter,
			EVENT_CHANGE_MODE
		);
		this._changeCurrentLayer = new EventListenerImpl(
			this,
			eventEmitter,
			EVENT_CHANGE_CURRENT_LAYER
		);
		this._update = new EventListenerImpl(
			this,
			eventEmitter,
			EVENT_UPDATE
		);
	}

	/**
	 * プロパティ変更通知
	 */
	get changeProperties(): ChangeProperties {
		return this._changeProperties;
	}
	/**
	 * 編集モード編集通知
	 */
	get changeMode(): ModeChange {
		return this._changeMode;
	}

	/**
	 * 編集レイヤー変更通知
	 */
	get changeCurrentLayer(): ChangeCurrentLayer {
		return this._changeCurrentLayer;
	}

	/**
	 * 更新通知
	 */
	get update(): Update {
		return this._update;
	}
}

class EventListenerImpl<F extends Function> implements IEventListener<F> {

	private eventEmitter: emitter.EventEmitter;
	private eventName: string;
	private eventListeners: EditorEventListeners;

	constructor(
		eventListeners: EditorEventListeners,
		eventEmitter: emitter.EventEmitter,
		eventName: string
	) {
		this.eventEmitter = eventEmitter;
		this.eventName = eventName;
		this.eventListeners = eventListeners;
	}

	on(listener: F): EditorEventListeners {
		this.eventEmitter.on(this.eventName, <any>listener);
		return this.eventListeners;
	}

	once(listener: F): EditorEventListeners {
		this.eventEmitter.once(this.eventName, <any>listener);
		return this.eventListeners;
	}

	off(listener: F): EditorEventListeners {
		this.eventEmitter.off(this.eventName, <any>listener);
		return this.eventListeners;
	}
}