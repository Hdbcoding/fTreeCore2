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

    function Canvas(container, width, height) {
        this._container = container;
        this._width = width;
        this._height = height;
        this._$canvas = $('<canvas>')
            .attr({ width: width, height: height })
            .appendTo(container);
        this._ctx = this._$canvas[0].getContext('2d');
        this._nodes = [];
        this._edges = [];
        this._offsetX = this._offsetY = 0;
        this._zoomFactor = 1;
    }
    Canvas.prototype = {
        clear: function () {
            //top left corner
            var tl = this.getCoordinates(0, 0);
            //bottom right corner
            var br = this.getCoordinates(this._width, this._height);
            var w0 = br.x - tl.x;
            var h0 = br.y - tl.y;

            this._ctx.fillStyle = 'black';
            this._ctx.fillRect(tl.x, tl.y, w0, h0);
        },
        addNode: function (n) {
            if (visualElement.isNode(n) && !this.containsNode(n))
                this._nodes.push(n);
        },
        addEdge: function (e) {
            if (visualElement.isEdge(e) && !this.containsEdge(e))
                this._edges.push(e);
        },
        removeAllElements: function () {
            //probably too dangerous to keep long term
            this._nodes = [];
            this._edges = [];
            this.render();
        },
        removeNode: function (node) {
            var nIndex = this._nodes.indexOf(node);
            if (nIndex !== -1) {
                this._nodes.splice(nIndex, 1);
                var edges = this._edges.filter(e => e.isAttachedToNode(node));
                for (let i = 0; i < edges.length; i++) {
                    this.removeEdge(edges[i]);
                }
            }
        },
        removeEdge: function (edge) {
            var eIndex = this._edges.indexOf(edge);
            if (eIndex !== -1) {
                this._edges.splice(eIndex, 1);
                var childEdges = this._edges.filter(n => visualElement.isChildEdge(n) && n.isAttachedToEdge(edge));
                for (let i = 0; i < childEdges.length; i++) {
                    this.removeEdge(childEdges[i]);
                }
            }
        },
        containsNode: function (n) {
            return this._nodes.includes(n);
        },
        containsEdge: function (e) {
            return this._edges.includes(e);
        },
        render: function () {
            this.clear();
            this._edges.forEach(e => e.draw(this._ctx));
            this._nodes.forEach(n => n.draw(this._ctx));
        },
        getElementsAt: function (x, y) {
            var nodesAt = this._nodes.filter(e => e.isInBounds(x, y));
            var edgesAt = this._edges.filter(e => e.isInBounds(x, y));
            return { nodes: nodesAt, edges: edgesAt };
        },
        bringToFront: function (element) {
            var index = this._nodes.indexOf(element);
            var last = this._nodes.length - 1;
            if (index != last) {
                var old = this._nodes[last];
                this._nodes[index] = old;
                this._nodes[last] = element;
            }
        },
        //ctx transform:
        // a c e
        // b d f
        // 0 0 1
        _transform: function () {
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
        zoom: function (dz, x, y) {
            x = x || this._width / 2;
            y = y || this._height / 2;

            this._zoomFactor *= dz;
            this._offsetX = x * (1 - dz) + this._offsetX * dz;
            this._offsetY = y * (1 - dz) + this._offsetY * dz;
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
        getScaled: function (x, y) {
            return {
                x: x / this._zoomFactor,
                y: y / this._zoomFactor
            }
        }
    };

    //creates an instance of the canvas api, or finds a matching instance, and returns it
    canvasApi.createInstance = function (inputSettings) {
        var settings = $.extend(true, {}, defaults, inputSettings);

        //only one canvas per container. If we've already added a canvas here return the old one
        var old = getInstance(settings.container);
        if (old) return old;

        //create canvas using the ~~prototype~~
        let instance = new Canvas(settings.container, settings.width, settings.height);
        instance.clear();
        canvases.push(instance);
        return instance;
    }

    var getInstance = canvasApi.getInstance = function (container) {
        for (let i = 0; i < canvases.length; i++) {
            var objInstance = canvases[i];
            if (objInstance._container == container) return objInstance;
        }
        return false;
    }
})($, window);