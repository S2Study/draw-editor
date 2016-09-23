import DrawchatCanvas = drawchat.editor.DrawchatCanvas;
import TextTransaction = drawchat.updater.TextTransaction;
import {EditorProperties} from "./EditorProperties";
import DrawchatViewer = drawchat.viewer.DrawchatViewer;
export class ModeText implements DrawchatCanvas{

	private viewer:DrawchatViewer;
	private tran:TextTransaction;
	private prop:EditorProperties;

	constructor(
		viewer:DrawchatViewer,
		tran:TextTransaction,
		prop:EditorProperties
	){
		this.viewer = viewer;
		this.tran = tran;
		this.prop = prop;
		this.tran.setSavePoint();
	}

	private text:string;

	private pointX:number;
	private pointY:number;
	private time:number;
	private waiting:boolean;

	touchStart(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		this.pointX = x;
		this.pointY = y;
		this.drawText();
	}

	touchMove(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		this.pointX = x;
		this.pointY = y;
		let latest = new Date().getTime();
		if((latest - this.time) < 50){
			this.setWait();
			return;
		}
		this.time = latest;
		this.drawText();
	}

	touchEnd(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		this.pointX = x;
		this.pointY = y;
		this.drawText();
	}

	setText(text:string):void {
		if(!this.tran.isAlive()){
			return;
		}
		this.text = text;
		this.drawText();
	}

	private setWait():void {
		if (this.waiting) {
			return;
		}
		this.waiting = true;
		setTimeout(()=> {
			if(!this.waiting){
				return;
			}
			this.waiting = false;
			if(!this.tran.isAlive()){
				return;
			}
			let now = new Date().getTime();
			if (now - this.time < 100) {
				this.setWait();
				return;
			}
			this.drawText();
		}, 100);
	}

	private drawText():void{
		this.waiting = false;
		this.viewer.stop();
		try {
			this.tran.restoreSavePoint();
			this.tran.setSize(this.prop.fontSize);
			this.tran.setFontFamily(this.prop.fontFamily);
			// this.tran.setStrokeColor(`rgb(${this.prop.color.r},${this.prop.color.g},${this.prop.color.b},${this.prop.alpha})`);
			this.tran.setFill(`rgba(${this.prop.color.r},${this.prop.color.g},${this.prop.color.b},${this.prop.alpha})`);
			this.tran.setPosition(this.pointX, this.pointY);
			this.tran.push(this.text);
		} finally {
			this.tran.flush();
			this.viewer.start();
		}
	}

	backward():void {
	}

	forward():void {
	}
}