"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var TouchEventBinder = (function () {
    function TouchEventBinder(editor) {
        var _this = this;
        this.editor = editor;
        this.touchMoving = true;
        this.touchMoving = false;
        this.mouseMoving = false;
        this.click = false;
        this.lPointX = 0 | 0;
        this.lPointY = 0 | 0;
        this.lForce = null;
        this.element = null;
        this.touchStart = function (ev) {
            _this.flush();
            // マルチタップはサポートしない。
            if (ev.touches.length > 1) {
                _this.touchMoving = false;
                return;
            }
            _this.touchMoving = true;
            ev.preventDefault();
            var touch = ev.touches[0];
            var force = touch.force;
            _this.setStart(touch, force);
        };
        this.touchMove = function (ev) {
            if (!_this.touchMoving) {
                return;
            }
            ev.preventDefault();
            // マルチタップはサポートしない。
            if (ev.touches.length > 1) {
                _this.flush();
                return;
            }
            var touch = ev.touches[0];
            var force = touch.force;
            _this.setMove(touch, force);
        };
        this.touchEnd = function (ev) {
            if (!_this.touchMoving) {
                return;
            }
            ev.preventDefault();
            _this.flush();
        };
        this.mouseMove = function (event) {
            if (_this.touchMoving || !_this.click) {
                return;
            }
            _this.mouseMoving = true;
            _this.setMove(event);
        };
        this.mouseDown = function (event) {
            if (_this.touchMoving) {
                return;
            }
            _this.click = true;
            _this.setStart(event);
        };
        this.mouseUp = function (event) {
            if (_this.touchMoving) {
                return;
            }
            _this.flush();
        };
        this.mouseOut = function (event) {
            if (_this.touchMoving) {
                return;
            }
            _this.flush();
        };
    }
    TouchEventBinder.prototype.setStart = function (event, force) {
        var point = this.getOffset(this.element, event);
        this.lPointX = point.x | 0;
        this.lPointY = point.y | 0;
        this.lForce = force;
        this.editor.canvas.touchStart(point.x, point.y, force);
    };
    TouchEventBinder.prototype.setMove = function (event, force) {
        var point = this.getOffset(this.element, event);
        this.lPointX = point.x | 0;
        this.lPointY = point.y | 0;
        this.lForce = force;
        this.editor.canvas.touchMove(point.x, point.y, force);
    };
    TouchEventBinder.prototype.flush = function () {
        if (!this.touchMoving && !this.mouseMoving) {
            return;
        }
        this.touchMoving = false;
        this.mouseMoving = false;
        this.click = false;
        this.editor.canvas.touchEnd(this.lPointX, this.lPointY, this.lForce);
    };
    TouchEventBinder.prototype.bind = function (element) {
        this.element = element;
        document.addEventListener("mousemove", this.mouseMove);
        element.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", this.mouseUp, true);
        // element.addEventListener("mouseout", this.mouseOut);
        element.addEventListener("touchstart", this.touchStart);
        document.addEventListener("touchmove", this.touchMove);
        document.addEventListener("touchend", this.touchEnd, true);
        document.addEventListener("touchcancel", this.touchEnd, true);
    };
    TouchEventBinder.prototype.unBind = function () {
        if (this.element === null) {
            return;
        }
        var element = this.element;
        this.element = null;
        document.removeEventListener("mousemove", this.mouseMove);
        element.removeEventListener("mousedown", this.mouseDown);
        document.removeEventListener("mouseup", this.mouseUp, true);
        // element.removeEventListener("mouseout", this.mouseOut);
        element.removeEventListener("touchstart", this.touchStart);
        document.removeEventListener("touchmove", this.touchMove);
        document.removeEventListener("touchend", this.touchEnd, true);
        document.removeEventListener("touchcancel", this.touchEnd, true);
    };
    TouchEventBinder.prototype.getOffset = function (element, event) {
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        var rect = element.getBoundingClientRect();
        var positionX = rect.left + window.pageXOffset;
        var positionY = rect.top + window.pageYOffset;
        return new Point(mouseX - positionX, mouseY - positionY);
    };
    return TouchEventBinder;
}());
exports.TouchEventBinder = TouchEventBinder;
//# sourceMappingURL=TouchEventBinder.js.map