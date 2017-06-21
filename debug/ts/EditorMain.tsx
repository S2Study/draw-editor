import * as React from "react";
import * as styles from "./EditorMainStyle.scss";
import {Editor} from "../../src/Editor";
import {TouchEventBinder} from "./TouchEventBinder";

export class EditorMainState {
	click: boolean;
	moving: boolean;
	editor: Editor;
	touchEventBinder: TouchEventBinder;

	constructor(editor: Editor) {
		this.editor = editor;
		this.touchEventBinder = new TouchEventBinder(editor);
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
		state1.touchEventBinder.bind(element);
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

	componentWillMount(): void {
		let state1: EditorMainState = this.state;
		state1.editor.stop();
		state1.touchEventBinder.unBind();
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
