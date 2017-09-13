(function ($, window, undefined) {
    'use strict';
    var canvasApi = window.canvasApi = window.canvasApi || {};
    var defaults = {
        container: '', // container selector
        width: 500,
        height: 500
    };

    var canvases = [];

    //canvas API prototype
    // pwease no steppy on _private fields
    var canvasProto = {
        _init: function (container, width, height) {
            this._container = container;
            this._width = width;
            this._height = height;
            this._$canvas = this._$canvas || $('<canvas>')
                .attr({ width: width, height: height })
                .appendTo(container);
            this._elements = this._elements || [];
            this._ctx = this.ctx || this._$canvas[0].getContext('2d');
            this._offsetX = this._offsetY = 0;
            this._zoomFactor = 1;
        },
        clear: function () {
            this._ctx.fillStyle = 'black';
            this._ctx.fillRect(-this._offsetX, -this._offsetY, this._width, this._height);
        },
        addElement: function (element) {
            if (!this._elements.includes(element)) {
                this._elements.push(element);
            }
        },
        render: function () {
            this.clear();
            for (let i = 0; i < this._elements.length; i++) {
                this._elements[i].draw(this._ctx);
            }
        },
        //ctx transform:
        // a c e
        // b d f
        // 0 0 1
        panBy: function (dx, dy) {
            this._offsetX += dx;
            this._offsetY += dy;
            this._ctx.transform(1, 0, 0, 1, dx, dy);
        },
        panTo: function (x, y) {
            this._offsetX = x;
            this._offsetY = y;
            this._ctx.setTransform(this._zoomFactor, 0, 0, this._zoomFactor, x, y);
        },
        resetPan: function () {
            this.panTo(0, 0);
        },
        zoomBy: function (df) {
            this._zoomFactor *= df;
            this._ctx.transform(1 * df, 0, 0, 1 * df, 0, 0);
        },
        zoomTo: function (factor) {
            this._zoomFactor = factor;
            this._ctx.setTransform(factor, 0, 0, factor, this._offsetX, this._offsetY);
        },
        resetZoom: function(){
            this.zoomTo(1);
        }
    };

    canvasApi.init = function (inputSettings) {
        var settings = $.extend(true, {}, defaults, inputSettings);

        //only one canvas per container. If we've already added a canvas here return the old one
        var old = getCanvas(settings.container);
        if (old) return old;

        //create canvas using the ~~prototype~~
        let instance = Object.create(canvasProto);
        instance._init(settings.container, settings.width, settings.height);
        instance.clear();
        canvases.push(instance);
        return instance;
    }

    function getCanvas(container) {
        for (let i = 0; i < canvases.length; i++) {
            var objInstance = canvases[i];
            if (objInstance._container == container) return objInstance;
        }
        return false;
    }
})($, window);