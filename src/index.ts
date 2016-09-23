import DrawHistory = drawchat.core.DrawHistory;
import DrawchatEditorProperties = drawchat.editor.DrawchatEditorProperties;
import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import DrawchatEditor = drawchat.editor.DrawchatEditor;
import {Editor} from "./Editor";

export function createInstance(
	history:DrawHistory,
	renderer:DrawchatRenderer,
	properties?:DrawchatEditorProperties
):DrawchatEditor{
	return new Editor(history,renderer,properties);
}
export default createInstance;
