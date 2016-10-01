import * as drawchat from "@s2study/draw-api";

import DrawHistory = drawchat.history.DrawHistory;
import DrawchatEditorProperties = drawchat.editor.DrawEditorProperties;
import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import DrawchatEditor = drawchat.editor.DrawEditor;
import {Editor} from "./Editor";

export function createInstance(
	history: DrawHistory,
	renderer: DrawchatRenderer,
	properties?: DrawchatEditorProperties): DrawchatEditor {
	return new Editor(history, renderer, properties);
}
export default createInstance;
