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
var styles = require("./CanvasContainerStyle.scss");
var CanvasContainer = (function (_super) {
    __extends(CanvasContainer, _super);
    function CanvasContainer(props) {
        return _super.call(this, props) || this;
    }
    CanvasContainer.prototype.render = function () {
        var style = {
            width: this.props.editor.getWidth(),
            height: this.props.editor.getHeight()
        };
        return (React.createElement("div", { className: styles.container },
            React.createElement("div", { style: style, className: styles.container__background },
                React.createElement("div", { style: style, id: this.props.id, className: styles.container__canvas }))));
    };
    return CanvasContainer;
}(React.Component));
exports.CanvasContainer = CanvasContainer;
exports.default = CanvasContainer;
//# sourceMappingURL=CanvasContainer.js.map