import {EditorEventDispatchers} from "./EditorEventDispatchers";
import {Updater} from "@s2study/draw-updater/lib/Updator";
import {DrawViewer} from "@s2study/draw-viewer/lib/DrawViewer";
import {Editor} from "./Editor";
import {ChangeSequenceTransaction} from "@s2study/draw-updater/lib/ChangeSequenceTransaction";
export class Layers  {

	updater: Updater;
	viewer: DrawViewer;
	editor: Editor;
	currentId: string;

	private dispatcher: EditorEventDispatchers;

	constructor(
		updater: Updater,
		viewer: DrawViewer,
		editor: Editor,
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
		const ids = this.updater.getLayers();
		const len = ids.length | 0;
		for (let i = 0 | 0; i < len; i = (i + 1) | 0) {
			if (ids[i] === this.currentId) {
				return i;
			}
		}
		return -1;
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
			return Promise.resolve(this.getCurrentIndex()).then((index: number) => {
				if ( lastIndex !== index || lastCurrentId !== this.currentId) {
					this.dispatcher.changeCurrentLayer.dispatch(index);
				}
				return index;
			});
		};
	}
}