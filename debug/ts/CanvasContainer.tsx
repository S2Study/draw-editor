import * as React from "react";
import * as styles from "./CanvasContainerStyle.scss";
import {Editor} from "../../src/Editor";

export interface CanvasContainerProps {
	id: string;
	editor: Editor;
}

export class CanvasContainer extends React.Component<CanvasContainerProps, any> {
	constructor(props: CanvasContainerProps) {
		super(props);
	}

	render() {
		let style = {
			width: this.props.editor.getWidth(),
			height: this.props.editor.getHeight()
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
export default CanvasContainer;
