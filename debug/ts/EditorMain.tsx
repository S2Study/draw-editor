import * as React from "react";
import * as styles from "./EditorMainStyle.scss";
import {Editor} from "../../src/Editor";
// import {Editor} from "@s2study/draw-editor/lib/Editor";

class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

function EMPTY_FUNC(event: MouseEvent): void {}

export class EditorMainState {
	click: boolean;
	moving: boolean;
	editor: Editor;
	mouseOut: (event: MouseEvent) => void;
	mouseMove: (event: MouseEvent) => void;
	mouseDown: (event: MouseEvent) => void;
	mouseUp: (event: MouseEvent) => void;

	constructor(editor: Editor) {
		this.editor = editor;
	}
}
export interface EditorMainProps {
	id: string;
	editor: Editor;
}
export class EditorMain extends React.Component<EditorMainProps, EditorMainState> {

	constructor(props: EditorMainProps) {
		super(props);
		this.state = new EditorMainState(props.editor);
	}

	componentDidMount(): void {

		let state1: EditorMainState = this.state;
		state1.editor.reRender();
		state1.editor.start();
		let element = document.getElementById(this.props.id)!;

		state1.mouseMove = (event: MouseEvent) => {
			if (!state1.click) {
				return;
			}
			state1.moving = true;
			let point = this.getOffset(element, event);
			this.props.editor.canvas.touchMove(point.x, point.y);
		};
		state1.mouseDown = (event: MouseEvent) => {
			state1.click = true;
			let point = this.getOffset(element, event);
			this.props.editor.canvas.touchStart(point.x, point.y);
		};
		state1.mouseUp = (event: MouseEvent) => {
			this.drop(element, event);
		};
		state1.mouseOut = (event: MouseEvent) => {
			if (!this.state.moving) {
				return;
			}
			this.drop(element, event);
		};
		element.addEventListener("mousemove", this.state.mouseMove);
		element.addEventListener("mousedown", this.state.mouseDown);
		document.addEventListener("mouseup", this.state.mouseUp);
		element.addEventListener("mouseout", this.state.mouseOut);
	}

	private getCursor(): string {

		let mode = this.state.editor.mode;
		switch (mode.getMode()) {
			case mode.CHANGING:
				return "wait";
			case mode.CLIP_MODE:
				return "url(http://test.png),crosshair";
			case mode.ERASER_MODE:
				return "url(http://test.png),default";
			case mode.EYEDROPPER_MODE:
				return "url(http://test.png),default";
			case mode.FILL_MODE:
				return "url(http://test.png),default";
			case mode.TEXT_MODE:
				return "url(http://test.png),text";
			case mode.STROKE_MODE:
				return "url(http://test.png),default";
			case mode.HAND_TOOL_MODE:
				return "url(http://test.png),move";
			default:
				return "auto";
		}
	}

	private drop(element: Element, event: MouseEvent) {
		let state1: EditorMainState = this.state;
		state1.click = false;
		state1.moving = false;
		let point = this.getOffset(element, event);
		this.props.editor.canvas.touchEnd(point.x, point.y);
	}

	componentWillMount(): void {
		let state1: EditorMainState = this.state;
		state1.editor.stop();
		let element = document.getElementById(this.props.id);

		if (element == null) {
			return;
		}
		element.removeEventListener("mousemove", state1.mouseMove);
		element.removeEventListener("mousedown", state1.mouseDown);
		document.removeEventListener("mouseup", state1.mouseUp);
		element.removeEventListener("mouseout", state1.mouseOut);
		state1.mouseMove = EMPTY_FUNC;
		state1.mouseDown = EMPTY_FUNC;
		state1.mouseUp = EMPTY_FUNC;
	}

	private getOffset(element: Element, event: MouseEvent): Point {
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

	render() {
		let style = {
			width: this.props.editor.getWidth(),
			height: this.props.editor.getHeight(),
			cursor: this.getCursor()
		};
		return (
			<div className={styles.container}>
				<div style={style} className={styles.container__background}>
					<div style={style} id={this.props.id} className={styles.container__canvas}/>
				</div>
			</div>
		);
	}
}
export default EditorMain;
