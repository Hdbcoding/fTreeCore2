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
        drawCallback: visualElement.drawSquare
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
            else visualElement.drawSquare.call(this, ctx);
        }
    };

    visualElement.createElement = function (inputSettings) {
        var settings = $.extend(true, {}, defaults, inputSettings);
        var instance = Object.create(elementProto);
        instance._init(settings.x, settings.y, settings.width, settings.height, settings.drawOptions, settings.drawCallback);
        return instance;
    }

    visualElement.drawSquare = function (ctx) {
        ctx.save();

        ctx.rect(this._x, this._y, this._width, this._height);
        ctx.fillStyle = this._drawOptions.fillStyle;
        ctx.fill();
        ctx.strokeStyle = this._drawOptions.strokeStyle;
        ctx.stroke();

        ctx.restore();
    }
})(jQuery, window);