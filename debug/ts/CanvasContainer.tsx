import * as React from "react";
import * as styles from "./CanvasContainerStyle.scss";
import {Editor} from "../../src/Editor";
import {CSSProperties} from "react";

export interface CanvasContainerProps {
	id: string;
	editor: Editor;
	dx: number;
	dy: number;
}

export class CanvasContainer extends React.Component<CanvasContainerProps, any> {
	constructor(props: CanvasContainerProps) {
		super(props);
	}

	render() {
		let style = {
			position: "absolute",
			top: `${this.props.dx}px`,
			left: `${this.props.dy}px`,
			width: `${this.props.editor.getWidth()}px`,
			height: `${this.props.editor.getHeight()}px`
		} as CSSProperties;
		return (
			<div className={styles.container}>
				<div style={style} className={styles.container__background} />
				<div id={this.props.id} className={styles.container__canvas}/>
			</div>
		);
	}
}
export default CanvasContainer;
