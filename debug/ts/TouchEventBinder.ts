import {Editor} from "../../src/Editor";

class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class TouchEventBinder {

	readonly touchStart: ( event: TouchEvent) => void;
	readonly touchEnd: ( event: TouchEvent) => void;
	readonly touchMove: ( event: TouchEvent) => void;

	readonly mouseMove: (event: MouseEvent) => void;
	readonly mouseDown: (event: MouseEvent) => void;
	readonly mouseUp: (event: MouseEvent) => void;
	readonly mouseOut: (event: MouseEvent) => void;

	private element: Element | null;
	private touchMoving: boolean;
	private mouseMoving: boolean;
	private click: boolean;
	private lPointX: number;
	private lPointY: number;
	private lForce: number | undefined | null;

	constructor(
		private editor: Editor
	) {

		this.touchMoving = true;
		this.touchMoving = false;
		this.mouseMoving = false;
		this.click = false;
		this.lPointX = 0 | 0;
		this.lPointY = 0 | 0;
		this.lForce = null;
		this.element = null;

		this.touchStart = (ev: TouchEvent) => {

			this.flush();

			// マルチタップはサポートしない。
			if (ev.touches.length > 1) {
				this.touchMoving = false;
				return;
			}

			this.touchMoving = true;
			ev.preventDefault();
			const touch: Touch = ev.touches[0];
			const force = (<any>touch).force;
			this.setStart(touch, force);
		};

		this.touchMove = (ev: TouchEvent) => {

			if (!this.touchMoving) {
				return;
			}
			ev.preventDefault();

			// マルチタップはサポートしない。
			if (ev.touches.length > 1) {
				this.flush();
				return;
			}
			const touch: Touch = ev.touches[0];
			const force = (<any>touch).force;
			this.setMove(touch, force);
		};

		this.touchEnd = (ev: TouchEvent) => {
			if (!this.touchMoving) {
				return;
			}
			ev.preventDefault();
			this.flush();
		};

		this.mouseMove = (event: MouseEvent) => {
			if (this.touchMoving || !this.click) {
				return;
			}
			this.mouseMoving = true;
			this.setMove(event);
		};

		this.mouseDown = (event: MouseEvent) => {
			if (this.touchMoving) {
				return;
			}
			this.click = true;
			this.setStart(event);
		};

		this.mouseUp = (event: MouseEvent) => {
			if (this.touchMoving) {
				return;
			}
			this.flush();
		};

		this.mouseOut = (event: MouseEvent) => {
			if (this.touchMoving) {
				return;
			}
			this.flush();
		};
	}

	private setStart(event: MouseEvent | Touch, force?: number | null): void {
		let point = this.getOffset(this.element!, event);
		this.lPointX = point.x | 0;
		this.lPointY = point.y | 0;
		this.lForce = force;
		this.editor.canvas.touchStart(point.x, point.y, force);
	}

	private setMove(event: MouseEvent | Touch, force?: number | null): void {
		let point = this.getOffset(this.element!, event);
		this.lPointX = point.x | 0;
		this.lPointY = point.y | 0;
		this.lForce = force;
		this.editor.canvas.touchMove(point.x, point.y, force);
	}

	private flush(): void {
		if (!this.touchMoving && !this.mouseMoving) {
			return;
		}
		this.touchMoving = false;
		this.mouseMoving = false;
		this.click = false;
		this.editor.canvas.touchEnd(this.lPointX, this.lPointY, this.lForce);
	}

	bind(element: Element) {
		this.element = element;

		document.addEventListener("mousemove", this.mouseMove);
		element.addEventListener("mousedown", this.mouseDown);
		document.addEventListener("mouseup", this.mouseUp, true);
		// element.addEventListener("mouseout", this.mouseOut);

		element.addEventListener("touchstart", this.touchStart);
		document.addEventListener("touchmove", this.touchMove);
		document.addEventListener("touchend", this.touchEnd, true);
		document.addEventListener("touchcancel", this.touchEnd, true);
	}

	unBind(): void {

		if (this.element === null) {
			return;
		}
		const element = this.element;
		this.element = null;

		document.removeEventListener("mousemove", this.mouseMove);
		element.removeEventListener("mousedown", this.mouseDown);
		document.removeEventListener("mouseup", this.mouseUp, true);
		// element.removeEventListener("mouseout", this.mouseOut);

		element.removeEventListener("touchstart", this.touchStart);
		document.removeEventListener("touchmove", this.touchMove);
		document.removeEventListener("touchend", this.touchEnd, true);
		document.removeEventListener("touchcancel", this.touchEnd, true);
	}

	private getOffset(element: Element, event: MouseEvent | Touch): Point {
		let mouseX = event.pageX;
		let mouseY = event.pageY;
		let rect = element.getBoundingClientRect();
		let positionX = rect.left + window.pageXOffset;
		let positionY = rect.top + window.pageYOffset;
		return new Point(
			mouseX - positionX,
			mouseY - positionY
		);
	}
}
