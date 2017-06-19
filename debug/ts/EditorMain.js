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
// import {Editor} from "@s2study/draw-editor/lib/Editor";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
function EMPTY_FUNC(event) { }
var EditorMainState = (function () {
    function EditorMainState(editor) {
        this.editor = editor;
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
        var _this = this;
        var state1 = this.state;
        state1.editor.reRender();
        state1.editor.start();
        var element = document.getElementById(this.props.id);
        state1.mouseMove = function (event) {
            if (!state1.click) {
                return;
            }
            state1.moving = true;
            var point = _this.getOffset(element, event);
            _this.props.editor.canvas.touchMove(point.x, point.y);
        };
        state1.mouseDown = function (event) {
            state1.click = true;
            var point = _this.getOffset(element, event);
            _this.props.editor.canvas.touchStart(point.x, point.y);
        };
        state1.mouseUp = function (event) {
            _this.drop(element, event);
        };
        state1.mouseOut = function (event) {
            if (!_this.state.moving) {
                return;
            }
            _this.drop(element, event);
        };
        element.addEventListener("mousemove", this.state.mouseMove);
        element.addEventListener("mousedown", this.state.mouseDown);
        document.addEventListener("mouseup", this.state.mouseUp);
        element.addEventListener("mouseout", this.state.mouseOut);
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
    EditorMain.prototype.drop = function (element, event) {
        var state1 = this.state;
        state1.click = false;
        state1.moving = false;
        var point = this.getOffset(element, event);
        this.props.editor.canvas.touchEnd(point.x, point.y);
        this.props.editor.generateMessage().then(function (message) {
            console.log(JSON.stringify(message.toJSON()));
        });
    };
    EditorMain.prototype.componentWillMount = function () {
        var state1 = this.state;
        state1.editor.stop();
        var element = document.getElementById(this.props.id);
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
    };
    EditorMain.prototype.getOffset = function (element, event) {
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        var rect = element.getBoundingClientRect();
        var positionX = rect.left + window.pageXOffset;
        var positionY = rect.top + window.pageYOffset;
        return new Point(mouseX - positionX, mouseY - positionY);
    };
    EditorMain.prototype.render = function () {
        var style = {
            width: this.props.editor.getWidth(),
            height: this.props.editor.getHeight(),
            cursor: this.getCursor()
        };
        return (React.createElement("div", { className: styles.container },
            React.createElement("div", { style: style, className: styles.container__background },
                React.createElement("div", { style: style, id: this.props.id, className: styles.container__canvas }))));
    };
    return EditorMain;
}(React.Component));
exports.EditorMain = EditorMain;
exports.default = EditorMain;
//# sourceMappingURL=EditorMain.js.map