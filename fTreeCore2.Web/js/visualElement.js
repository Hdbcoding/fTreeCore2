/**
 * Visual elements, such as nodes and edges.
 * elements can be drawn on a canvas with a drawing context
 */
(function ($, window, undefined) {
    'use strict';
    var visualElement = window.visualElement = window.visualElement || {};

    //node: A box, with a shape and size, that can be moved around
    //methods: {isInBounds, draw, moveBy, moveTo, getShape}
    function Node(x, y, w, h, fill, stroke) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._fill = fill;
        this._stroke = stroke;
    }

    Node.prototype = {
        isInBounds: function (x, y) {
            return x >= this._x
                && x <= this._x + this._w
                && y >= this._y
                && y <= this._y + this._h;
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.rect(this._x, this._y, this._w, this._h);
            ctx.fillStyle = this._fill;
            ctx.fill();
            ctx.strokeStyle = this._stroke;
            ctx.stroke();
            ctx.closePath();
        },
        moveBy: function (dx, dy) {
            this._x += dx;
            this._y += dy;
        },
        moveTo: function (x, y) {
            this._x = x;
            this._y = y;
        },
        getShape: function () {
            return {
                x: this._x,
                y: this._y,
                w: this._w,
                h: this._h
            };
        }
    }

    visualElement.createNode = function (x = 0, y = 0, w = 50, h = 50, fill = 'white', stroke = 'red') {
        return new Node(x, y, w, h, fill, stroke);
    }

    //experimental base prototype for both edge types...
    var edgeProto = {
        draw: function (ctx) {
            var ep = this.getEndpoints();
            ctx.beginPath();
            ctx.moveTo(ep.x1, ep.y1);
            ctx.lineTo(ep.x2, ep.y2);
            ctx.strokeStyle = this._stroke;
            ctx.stroke();
            ctx.closePath();
        },
        isInBounds: function (x, y) {
            //concept - an edge has some delta around it where clicks can be registered
            //distance from point to line must be smaller than delta to be a click
            var ep = this.getEndpoints();
            var delta = 10; //random delta, needs calculation
            var d = distanceFromLine(ep.x1, ep.y1, ep.x2, ep.y2, x, y);

            return d < delta;
        },
        getEndpoints: function () {
            this.updateEndpoints();
            return {
                x1: this._x1,
                x2: this._x2,
                y1: this._y1,
                y2: this._y2
            }
        },
        updateEndpoints: function () {
            throw 'abstract base method - implement updateEndpoints!';
        }
    }

    //parentEdge: A line connecting two nodes
    //methods: {isInBounds, draw}
    function ParentEdge(n1, n2, stroke) {
        //concept - an edge is a connection between two nodes
        this._n1 = n1;
        this._n2 = n2;
        this._stroke = stroke;

        this.updateEndpoints();
    }

    var parentProto = Object.create(edgeProto);
    parentProto.updateEndpoints = function () {
        //concept - endpoints can be calculated based on the positions and sizes of the two nodes
        //for now let's just be lazy and do centers
        if (!this._updateComponentPositions()) return;

        var center1 = centerOfRect(this._oldN1.x, this._oldN1.y, this._oldN1.w, this._oldN1.y);
        this._x1 = center1.x;
        this._y1 = center1.y;
        var center2 = centerOfRect(this._oldN2.x, this._oldN2.y, this._oldN2.w, this._oldN2.y);
        this._x2 = center2.x;
        this._y2 = center2.y;
    }
    parentProto._updateComponentPositions = function () {
        //updates the cache for node position/size
        //if positions and sizes changed, return true
        var changed = false;

        var newN1 = this._n1.getShape();
        var newN2 = this._n2.getShape();
        var oldN1 = this._oldN1 || {};
        var oldN2 = this._oldN2 || {};

        if (newN1.x != oldN1.x || newN1.y != oldN2.y
            || newN1.w != oldN1.w || newN1.h != oldN1.h
            || newN2.x != oldN2.x || newN2.y != oldN2.y
            || newN2.w != oldN2.w || newN2.h != oldN2.h)
            changed = true;

        this._oldN1 = newN1;
        this._oldN2 = newN2;
        return changed;
    }


    parentProto.prototype = edgeProto;
    ParentEdge.prototype = parentProto;

    visualElement.createParentEdge = function (node1, node2, stroke = 'green') {
        return new ParentEdge(node1, node2, stroke);
    }

    //childEdge: a line connecting an edge to a node
    //methods: {isInBounds, draw, attachEdge, attachNode}
    function ChildEdge(e, n, stroke) {
        this._e = e;
        this._n = n;
        this._stroke = stroke;

        this.updateEndpoints();
    }

    var childProto = Object.create(edgeProto);
    childProto.updateEndpoints = function () {
        //calculate endpoints based on the position and size of the node and edge
        if (!this._updateComponentPositions()) return;

        var center1 = centerOfRect(this._oldN.x, this._oldN.y, this._oldN.w, this._oldN.h);
        this._x1 = center1.x;
        this._y1 = center1.y;
        var center2 = centerOfLine(this._oldE.x1, this._oldE.y1, this._oldE.x2, this._oldE.y2);
        this._x2 = center2.x;
        this._y2 = center2.y;
    }
    childProto._updateComponentPositions = function () {
        //updates the cache for node position/size
        //if positions and sizes changed, return true
        var changed = false;
        var newN = this._n.getShape();
        var newE = this._e.getEndpoints();
        var oldN = this.oldN || {};
        var oldE = this.oldE || {};

        if (newN.x != oldN.x || newN.y != oldN.y
            || newN.w != oldN.w || newN.h != oldN.h
            || newE.x1 != oldE.x1 || newE.y1 != oldE.y1
            || newE.x2 != oldE.x2 || newE.y2 != oldE.y2)
            changed = true;

        this._oldN = newN;
        this._oldE = newE;

        return changed;
    }

    childProto.prototype = edgeProto;
    ChildEdge.prototype = childProto;

    visualElement.createChildEdge = function (edge, node, stroke = 'red') {
        return new ChildEdge(edge, node, stroke);
    }

    //geometry functions
    function distanceBetweenPoints(x1, y1, x2, y2) {
        //distance between two points
        return Math.sqrt(
            Math.pow(y2 - y1, 2)
            + Math.pow(x2 - x1, 2)
        );
    }

    function distanceFromLine(lx1, ly1, lx2, ly2, x, y) {
        return Math.abs((ly2 - ly1) * x - (lx2 - lx1) * y + lx2 * ly1 - ly2 - lx1)
            / distanceBetweenPoints(lx1, ly1, lx2, ly2);
    }

    function centerOfLine(lx1, ly1, lx2, ly2) {
        return { x: (lx1 + lx2) / 2, y: (ly1 + ly2) / 2 };
    }

    function centerOfRect(x, y, w, h) {
        return {
            x: (2 * x + w) / 2,
            y: (2 * y + h) / 2
        };
    }

})(jQuery, window);