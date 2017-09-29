(function ($, window, undefined) {
    'use strict';
    var visualElement = window.visualElement = window.visualElement || {};
    var defaults = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        drawOptions: {
            fillStyle: 'white',
            strokeStyle: 'red',
        },
        drawCallback: drawRect
    };

    var elementProto = {
        _init: function (x, y, width, height, drawOptions, drawCallback) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
            this._drawOptions = drawOptions;
            this._drawCallback = drawCallback;
        },
        draw: function (ctx) {
            if ($.isFunction(this._drawCallback)) this._drawCallback(ctx);
            else drawRect.call(this, ctx);
        },
        moveBy: function (dx, dy) {
            this._x += dx;
            this._y += dy;
        },
        moveTo: function (x, y) {
            this._x = x;
            this._y = y;
        }
    };

    visualElement.createElement = function (inputSettings) {
        var settings = $.extend(true, {}, defaults, inputSettings);
        var instance = Object.create(elementProto);
        instance._init(settings.x, settings.y, settings.width, settings.height, settings.drawOptions, settings.drawCallback);
        return instance;
    }

    visualElement.createRect = function (inputSettings) {
        return visualElement.createElement($.extend(true, {}, inputSettings, { drawCallback: drawRect }));
    }

    visualElement.createLine = function (inputSettings) {
        var dO = inputSettings.drawOptions
        var x = Math.min(dO.x1, dO.x2);
        var y = Math.min(dO.y1, dO.y2);
        var width = Math.abs(dO.x1 - dO.x2);
        var height = Math.abs(dO.y1 - dO.y2);
        var settings = $.extend(true,
            { x: x, y: y, width: width, height: height },
            inputSettings,
            { drawCallback: drawLine });
        return visualElement.createElement(settings);
    }

    var drawRect = function (ctx) {
        ctx.beginPath();
        ctx.rect(this._x, this._y, this._width, this._height);
        ctx.fillStyle = this._drawOptions.fillStyle;
        ctx.fill();
        ctx.strokeStyle = this._drawOptions.strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }

    //may need a different prototype for lines, since they have different interactivity requirements
    var drawLine = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this._drawOptions.x1, this._drawOptions.y1);
        ctx.lineTo(this._drawOptions.x2, this._drawOptions.y2);
        ctx.strokeStyle = this._drawOptions.strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }
})(jQuery, window);