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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles = require("./EditorRootStyle.scss");
var draw_canvas2d_renderer_1 = require("@s2study/draw-canvas2d-renderer");
var editors = require("../../src/index");
var EditorMain_1 = require("./EditorMain");
var CanvasContainer_1 = require("./CanvasContainer");
var EditorRootState = (function () {
    function EditorRootState(editor, canvasId) {
        this.currentLayer = -1;
        this.layerCount = 0;
        this.modeChangeFirst = true;
        this.editor = editor;
        this.canvasId = canvasId;
        this.latest = -1;
        // this.colors = [
        // 	ColorFactory.createInstance(0, 0, 0),
        // 	ColorFactory.createInstance(255, 255, 0),
        // 	ColorFactory.createInstance(255, 0, 255),
        // 	ColorFactory.createInstance(0, 255, 255),
        // ];
        // this.modeItems = [
        // 	new ModeItem(editor.mode.STROKE_MODE, 1),
        // 	new ModeItem(editor.mode.STROKE_MODE, 12),
        // 	new ModeItem(editor.mode.STROKE_MODE, 24),
        // 	// new ModeItem(editor.mode.FILL_MODE),
        // 	new ModeItem(editor.mode.HAND_TOOL_MODE),
        // 	// new ModeItem(editor.mode.TEXT_MODE),
        // 	// new ModeItem(editor.mode.CLIP_MODE),
        // 	new ModeItem(editor.mode.EYEDROPPER_MODE),
        // 	new ModeItem(editor.mode.ERASER_MODE, 24),
        // ];
    }
    return EditorRootState;
}());
exports.EditorRootState = EditorRootState;
var EditorRoot = (function (_super) {
    __extends(EditorRoot, _super);
    function EditorRoot(props) {
        var _this = _super.call(this, props) || this;
        var canvasId = props.canvasElement == null ? "editorCanvas" : props.canvasElement;
        var renderer = draw_canvas2d_renderer_1.default.createDOMRenderer(canvasId, props.canvasWidth == null ? 1000 : props.canvasWidth, props.canvasHeight == null ? 800 : props.canvasHeight, 200, 200);
        _this.state = new EditorRootState(editors.createInstance(props.history, renderer), canvasId);
        return _this;
    }
    /**
     * プロパティの補完
     * @returns {boolean}
     */
    EditorRoot.prototype.complementProps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var layers, count, current, _state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layers = this.state.editor.layers;
                        return [4 /*yield*/, layers.layerCount()];
                    case 1:
                        count = _a.sent();
                        return [4 /*yield*/, layers.getCurrent()];
                    case 2:
                        current = _a.sent();
                        _state = this.state;
                        _state.layerCount = count;
                        _state.currentLayer = current;
                        if (!(count === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, layers.addLayer()];
                    case 3:
                        _a.sent();
                        this.refresh();
                        return [2 /*return*/, true];
                    case 4:
                        if (count >= 0 && current >= 0 && current < count) {
                            _state.latest = current;
                            return [2 /*return*/, this.complementMode()];
                        }
                        if (!(_state.latest >= 0 && _state.latest < count)) return [3 /*break*/, 6];
                        return [4 /*yield*/, layers.setCurrent(_state.latest)];
                    case 5:
                        _a.sent();
                        this.refresh();
                        return [2 /*return*/, true];
                    case 6:
                        _state.latest = count - 1;
                        return [4 /*yield*/, layers.setCurrent(count - 1)];
                    case 7:
                        _a.sent();
                        this.refresh();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    EditorRoot.prototype.complementMode = function () {
        var _this = this;
        var _state = this.state;
        var mode = _state.editor.mode.getMode();
        if ((mode >= 0 && mode !== _state.editor.mode.CHANGING)
            || (mode === _state.editor.mode.CHANGING && !_state.modeChangeFirst)) {
            return false;
        }
        _state.modeChangeFirst = false;
        var changer = _state.editor.mode;
        changer.changeMode(changer.BRUSH_MODE).then(function () {
            _state.editor.properties.thickness = 3;
            _this.refresh();
        });
        return true;
    };
    /**
     * 画面リフレッシュ
     */
    EditorRoot.prototype.refresh = function () {
        var _this = this;
        this.complementProps().then(function (doing) {
            if (!doing) {
                _this.setState(_this.state);
            }
        });
    };
    /**
     * コンポーネントマウント時の処理
     */
    EditorRoot.prototype.componentDidMount = function () {
        this.complementProps().then(function () {
            return null;
        });
    };
    // modeSelect(index: number): void {
    //
    // 	const _state: EditorRootState = this.state;
    // 	_state.modeItems = _state.modeItems.map((item, i) => {
    // 		return new ModeItem(item.mode, item.thickness, i === index);
    // 	});
    // 	let selected = _state.modeItems[index];
    // 	_state.editor.mode.changeMode(selected.mode).then(() => {
    // 		_state.editor.properties.thickness = selected.thickness;
    // 		this.refresh();
    // 	});
    // }
    EditorRoot.prototype.render = function () {
        var _state = this.state;
        return (React.createElement("div", { style: {
                width: 1000,
                height: 800
            }, className: styles.container },
            React.createElement("div", { className: styles.canvasContainer },
                React.createElement(CanvasContainer_1.CanvasContainer, { id: _state.canvasId, editor: _state.editor, dx: 200, dy: 200 })),
            React.createElement("div", { className: styles.canvasContainer },
                React.createElement(EditorMain_1.EditorMain, { id: _state.canvasId + "_eventLayer", editor: _state.editor, dx: 200, dy: 200 }))));
    };
    return EditorRoot;
}(React.Component));
exports.EditorRoot = EditorRoot;
//# sourceMappingURL=EditorRoot.js.map