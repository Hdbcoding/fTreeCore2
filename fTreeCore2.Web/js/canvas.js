/**
 * Base canvas functionality, such as panning, zooming, and rendering a set of contained visual elements
 */
(function ($, window, undefined) {
    'use strict';
    var canvasApi = window.canvasApi = window.canvasApi || {};
    var defaults = {
        container: '', // container selector
        width: 500,
        height: 500
    };
    var canvases = [];

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
            //top left corner
            var tl = this.getCoordinates(0,0);
            //bottom right corner
            var br = this.getCoordinates(this._width, this._height);
            var w0 = br.x - tl.x;
            var h0 = br.y - tl.y;

            this._ctx.fillStyle = 'black';
            this._ctx.fillRect(tl.x, tl.y, w0, h0);
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
        bringToFront: function(element){
            var index = this._elements.indexOf(element);
            var last = this._elements.length - 1;
            if (index != last){
                var old = this._elements[last];
                this._elements[index] = old;
                this._elements[last] = element;
            }
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
            this._offsetX += dx;
            this._offsetY += dy;
            this._transform();
        },
        panTo: function (x, y) {
            this._offsetX = x;
            this._offsetY = y;
            this._transform();
        },
        resetPan: function () {
            this.panTo(0, 0);
        },
        zoom: function(dz, x, y){
            x = x || this._width / 2;
            y = y || this._height / 2;

            this._zoomFactor *= dz;
            this._offsetX = x * (1 - dz) + this._offsetX*dz;
            this._offsetY = y * (1 - dz) + this._offsetY*dz;
            this._transform();
        },
        resetZoom: function () {
            this._zoomFactor = 1;
            this._transform();
        },
        reset: function () {
            this.resetZoom();
            this.resetPan();
        },
        getCoordinates: function (x, y) {
            return this.getScaled(x - this._offsetX, y - this._offsetY);
        },
        getScaled: function(x, y){
            return {
                x: x / this._zoomFactor,
                y: y / this._zoomFactor
            }
        }
    };

    //creates an instance of the canvas api, or finds a matching instance, and returns it
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