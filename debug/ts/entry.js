"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var lib_1 = require("@s2study/draw-history/lib");
var EditorRoot_1 = require("./EditorRoot");
var history = lib_1.default.createInstance();
ReactDOM.render(React.createElement(EditorRoot_1.EditorRoot, { history: history }), document.getElementById("root"));
//# sourceMappingURL=entry.js.map