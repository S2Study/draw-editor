import * as drawchat from "@s2study/draw-api";

import DrawchatLayers = drawchat.editor.DrawEditorLayers;
import DrawchatUpdater = drawchat.updater.DrawchatUpdater;
import ChangeSequenceTransaction = drawchat.updater.ChangeSequenceTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import DrawchatEditor = drawchat.editor.DrawEditor;
import {EditorEventDispatchers} from "./EditorEventDispatchers";
export class Layers implements DrawchatLayers {

	updater: DrawchatUpdater;
	viewer: DrawchatViewer;
	editor: DrawchatEditor;
	currentId: string;

	private dispatcher: EditorEventDispatchers;

	constructor(
		updater: DrawchatUpdater,
		viewer: DrawchatViewer,
		editor: DrawchatEditor,
		dispatcher: EditorEventDispatchers
	) {
		this.updater = updater;
		this.viewer = viewer;
		this.editor = editor;
		this.dispatcher = dispatcher;
	}

	layerCount(): Promise<number> {
		return Promise.resolve(this.updater.getLayers().length);
	}

	setCurrent(index: number): Promise<any> {
		let layers = this.updater.getLayers();
		if (layers == null || layers.length <= index) {
			return Promise.resolve(null);
		}
		const notice = this.noticeChangeCurrent(
			this.currentId, this.getCurrentIndex()
		);
		this.currentId = layers[index];
		return this.editor.mode.changeMode(this.editor.mode.getMode())
			.then(notice);
	}

	getCurrent(): Promise<number> {
		return Promise.resolve(this.getCurrentIndex());
	}

	show(index: number): void {
		this.viewer.show([index]);
	}

	hide(index: number): void {
		this.viewer.hide([index]);
	}

	hideAll(): void {
		this.viewer.hide();
	}

	showAll(): void {
		this.viewer.show();
	}

	remove(index: number): Promise<any> {
		let layers = this.updater.getLayers();
		if (layers == null || layers.length <= index) {
			return Promise.reject(null);
		}
		const notice = this.noticeChangeCurrent(
			this.currentId, this.getCurrentIndex()
		);
		let lastMode = this.editor.mode.getMode();
		return this.updater.removeLayer(layers[index])
			.then(() => {
				this.setCurrent(index);
				if (!this.editor.mode.isAliveMode(lastMode)) {
					return null;
				}
				return this.editor.mode.changeMode(lastMode);
			})
			.then(notice);
	}

	addLayer(): Promise<any> {
		let lastMode = this.editor.mode.getMode();
		const notice = this.noticeChangeCurrent(
			this.currentId, this.getCurrentIndex()
		);
		return this.updater.addLayer().then(() => {
			if (!this.editor.mode.isAliveMode(lastMode)) {
				return null;
			}
			return this.editor.mode.changeMode(lastMode);
		}).then(notice);
	}

	moveTo(index: number): Promise<any> {
		const lastMode = this.editor.mode.getMode();
		const notice = this.noticeChangeCurrent(
			this.currentId, this.getCurrentIndex()
		);
		return this.updater.beginChangeSequence().then((tran: ChangeSequenceTransaction) => {
			tran.toMove(this.currentId, index).commit();
			return null;
		}).then(() => {
			if (!this.editor.mode.isAliveMode(lastMode)) {
				return null;
			}
			return this.editor.mode.changeMode(lastMode);
		}).then(notice);
	}

	private getCurrentIndex(): number {
		return this.updater.getLayers().findIndex((layerId: string) => {
			return layerId === this.currentId;
		});
	}

	/**
	 *
	 * @param lastCurrentId
	 * @param lastIndex
	 * @returns {Promise<number>}
	 */
	private noticeChangeCurrent(
		lastCurrentId: string,
		lastIndex: number
	): () => Promise<any> {
		return () => {
			return Promise.resolve(this.updater.getLayers().findIndex((layerId: string) => {
				return layerId === this.currentId;
			})).then((index: number) => {
				if ( lastIndex !== index || lastCurrentId !== this.currentId) {
					this.dispatcher.changeCurrentLayer.dispatch(index);
				}
				return index;
			});
		};
	}
}