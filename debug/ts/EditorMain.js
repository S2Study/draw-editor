"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles = require("./EditorMainStyle.scss");
var TouchEventBinder_1 = require("./TouchEventBinder");
var EditorMainState = (function () {
    function EditorMainState(editor) {
        this.editor = editor;
        this.touchEventBinder = new TouchEventBinder_1.TouchEventBinder(editor);
    }
    return EditorMainState;
}());
exports.EditorMainState = EditorMainState;
var EditorMain = (function (_super) {
    __extends(EditorMain, _super);
    function EditorMain(props) {
        var _this = _super.call(this, props) || this;
        _this.state = new EditorMainState(props.editor);
        return _this;
    }
    EditorMain.prototype.componentDidMount = function () {
        var state1 = this.state;
        state1.editor.reRender();
        state1.editor.start();
        var element = document.getElementById(this.props.id);
        state1.touchEventBinder.bind(element);
    };
    EditorMain.prototype.getCursor = function () {
        var mode = this.state.editor.mode;
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
    };
    EditorMain.prototype.componentWillMount = function () {
        var state1 = this.state;
        state1.editor.stop();
        state1.touchEventBinder.unBind();
    };
    EditorMain.prototype.render = function () {
        var style = {
            position: "absolute",
            top: this.props.dx + "px",
            left: this.props.dy + "px",
            width: this.props.editor.getWidth() + "px",
            height: this.props.editor.getHeight() + "px",
        };
        return (React.createElement("div", { className: styles.container },
            React.createElement("div", { style: style, className: styles.container__background },
                React.createElement("div", { id: this.props.id, className: styles.container__canvas }))));
    };
    return EditorMain;
}(React.Component));
exports.EditorMain = EditorMain;
exports.default = EditorMain;
//# sourceMappingURL=EditorMain.js.map