import * as React from "react";
import * as ReactDOM from "react-dom";
import History from "@s2study/draw-history/lib";
import {EditorRoot} from "./EditorRoot";

const history = History.createInstance();
ReactDOM.render(
	<EditorRoot history={history}/>,
	document.getElementById("root")
);
