import DrawchatLayers = drawchat.editor.DrawchatLayers;
import DrawchatUpdater = drawchat.updater.DrawchatUpdater;
import ChangeSequenceTransaction = drawchat.updater.ChangeSequenceTransaction;
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import DrawchatEditor = drawchat.editor.DrawchatEditor;
export class Layers implements DrawchatLayers{

	updater:DrawchatUpdater;
	viewer:DrawchatViewer;
	editor:DrawchatEditor;
	currentId:string;

	constructor(
		updater:DrawchatUpdater,
		viewer:DrawchatViewer,
		editor:DrawchatEditor
	){
		this.updater = updater;
		this.viewer = viewer;
		this.editor = editor;
	}

	layerCount():Promise<number> {
		return Promise.resolve(this.updater.getLayers().length);
	}

	setCurrent(index:number):Promise<any> {
		let layers = this.updater.getLayers();
		if(layers == null || layers.length <= index){
			return Promise.resolve(null);
		}
		this.currentId = layers[index];
		return this.editor.mode.changeMode(this.editor.mode.getMode());
	}

	getCurrent():Promise<number>{
		return Promise.resolve(this.updater.getLayers().findIndex((layerId:string)=>{
			return layerId === this.currentId;
		}));
	}

	show(index:number):void {
		this.viewer.show([index]);
	}

	hide(index:number):void {
		this.viewer.hide([index]);
	}

	hideAll():void {
		this.viewer.hide();
	}

	showAll():void {
		this.viewer.show();
	}

	remove(index:number):Promise<any> {
		let layers = this.updater.getLayers();
		if(layers == null || layers.length <= index){
			return Promise.reject(null);
		}
		let lastMode = this.editor.mode.getMode();
		return this.updater.removeLayer(layers[index])
			.then(()=>{
				this.setCurrent(index);
				if(!this.editor.mode.isAliveMode(lastMode)){
					return null;
				}
				return this.editor.mode.changeMode(lastMode);
			});
	}

	addLayer():Promise<any> {
		let lastMode = this.editor.mode.getMode();
		return this.updater.addLayer().then(()=>{
			if(!this.editor.mode.isAliveMode(lastMode)){
				return null;
			}
			return this.editor.mode.changeMode(lastMode);
		});
	}

	moveTo(index:number):Promise<any> {
		let lastMode = this.editor.mode.getMode();
		return this.updater.beginChangeSequence().then((tran:ChangeSequenceTransaction)=>{
			tran.toMove(this.currentId,index).commit();
			return null;
		}).then(()=>{
			if(!this.editor.mode.isAliveMode(lastMode)){
				return null;
			}
			return this.editor.mode.changeMode(lastMode);
		});
	}
}