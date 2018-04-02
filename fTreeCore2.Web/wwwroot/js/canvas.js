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
            var x0 = -this._offsetX / this._zoomFactor;
            var y0 = -this._offsetY / this._zoomFactor;
            var w0 = this._width / this._zoomFactor;
            var h0 = this._height / this._zoomFactor;

            this._ctx.fillStyle = 'black';
            this._ctx.fillRect(x0, y0, w0, h0);

            this._ctx.strokeStyle = getRndColor();
            this._ctx.strokeRect(x0, y0, w0, h0);
        },
        addElement: function (element) {
            if (!this.containsElement(element)) {
                this._elements.push(element);
            }
        },
        removeAllElements: function () {
            //probably too dangerous to keep long term
            this._elements = [];
            this.render();
        },
        removeElement: function (element) {
            var index = this._elements.indexOf(element);
            if (index !== -1) {
                this._elements.splice(index, 1);
            }
        },
        containsElement: function (element) {
            return this._elements.includes(element);
        },
        render: function () {
            this.clear();
            this._elements.forEach(ele => ele.draw(this._ctx));
        },
        getElementsAt: function (x, y) {
            return this._elements.filter(ele => ele.isInBounds(x, y));
        },
        //ctx transform:
        // a c e
        // b d f
        // 0 0 1
        _transform: function(){
            this._ctx.setTransform(
                this._zoomFactor, 
                0, 
                0, 
                this._zoomFactor, 
                this._offsetX, 
                this._offsetY
            );
        },
        panBy: function (dx, dy) {
            this._offsetX += dx / this._zoomFactor;
            this._offsetY += dy / this._zoomFactor;
            this._transform();
            // this._ctx.transform(1, 0, 0, 1, dx / this._zoomFactor, dy / this._zoomFactor);
        },
        panTo: function (x, y) {
            this._offsetX = x;
            this._offsetY = y;
            this._transform();
            // this._ctx.setTransform(this._zoomFactor, 0, 0, this._zoomFactor, x, y);
        },
        resetPan: function () {
            this.panTo(0, 0);
        },
        zoomBy: function (df) {
            this._zoomFactor *= df;
            this._transform();
            // this._ctx.transform(1 * df, 0, 0, 1 * df, 0, 0);
        },
        zoomTo: function (factor) {
            this._zoomFactor = factor;
            this._transform();
            // this._ctx.setTransform(factor, 0, 0, factor, this._offsetX, this._offsetY);
        },
        resetZoom: function () {
            this.zoomTo(1);
        },
        reset: function () {
            this.resetZoom();
            this.resetPan();
        },
        getCoordinates: function (x, y) {
            return {
                x: (x - this._offsetX) / this._zoomFactor,
                y: (y - this._offsetY) / this._zoomFactor
            }
        }
    };

    function getRndColor() {
        var r = 255 * Math.random() | 0,
            g = 255 * Math.random() | 0,
            b = 255 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

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