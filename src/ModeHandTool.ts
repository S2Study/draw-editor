import DrawchatCanvas = drawchat.editor.DrawchatCanvas;
import TransformTransaction = drawchat.updater.TransformTransaction;
export class ModeHandTool implements DrawchatCanvas{

	private tran:TransformTransaction;

	constructor(tran:TransformTransaction){
		this.tran = tran;
		this.tran.setSavePoint();
	}

	private time:number;
	sPointX:number;
	sPointY:number;

	private wPointX:number;
	private wPointY:number;
	private waiting:boolean;

	touchStart(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		this.tran.setSavePoint();
		this.sPointX = x;
		this.sPointY = y;
	}

	touchMove(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		let latest = new Date().getTime();
		if((latest - this.time) < 50){
			this.wPointX = x;
			this.wPointY = y;
			this.setWait();
			return;
		}
		this.time = latest;
		this.setTranslate(x,y);
		// this.tran.restoreSavePoint();
		// this.tran.translate(x - this.sPointX,y - this.sPointY);
	}

	touchEnd(x: number, y: number): void {
		if(!this.tran.isAlive()){
			return;
		}
		this.setTranslate(x,y);
		this.tran.commit(true);
		this.sPointX = null;
		this.sPointY = null;
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
			this.setTranslate(this.wPointX,this.wPointY)
		}, 100);
	}

	private setTranslate(x:number,y:number):void{
		this.waiting = false;
		if(this.sPointX == null || this.sPointY == null){
			return;
		}
		// console.log(`endPoint(${x},${y}) startPoint(${this.sPointX},${this.sPointY})`);
		this.tran.translate(x - this.sPointX,y - this.sPointY);
		this.tran.flush();
	}

	setText(text:string):void {
		//処理しない。
	}

	backward():void {
		//処理しない。
	}
}