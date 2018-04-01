(function ($, window, undefined) {
    'use strict';
    var visualElement = window.visualElement = window.visualElement || {};

    //new idea - nodes and edges
    //node: {isInBounds, draw, moveBy, moveTo}
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
        }
    }

    visualElement.createNode = function (x = 0, y = 0, w = 50, h = 50, fill = 'white', stroke = 'red') {
        return new Node(x, y, w, h, fill, stroke);
    }

    //edge: {isInBounds, draw, attachA, attachB}
    function Edge(n1, n2, stroke) {
        //concept - an edge is a connection between two nodes
        this._n1 = n1;
        this._n2 = n2;
        this._stroke = stroke;

        this._updateEndpoints();
    }

    Edge.prototype = {
        isInBounds: function (x, y) {
            //concept - an edge has some delta around it where clicks can be registered
            //distance from point to line must be smaller than delta to be a click
            var ep = this.getEndpoints();
            var delta = 10; //random delta, needs calculation
            var d =
                Math.abs((ep.y2 - ep.y1) * x - (ep.x2 - ep.x1) * y + ep.x2 * ep.y1 - ep.y2 - ep.x1)
                / distance(ep.x1, ep.y1, ep.x2, ep.y2);

            return d < delta;
        },
        draw: function (ctx) {
            var ep = this.getEndpoints();
            ctx.beginPath();
            ctx.moveTo(ep.x1, ep.y1);
            ctx.lineTo(ep.x2, ep.y2);
            ctx.strokeStyle = this._stroke;
            ctx.stroke();
            ctx.closePath();
        },
        getEndpoints: function () {
            this._updateEndpoints();
            return {
                x1: this._x1,
                x2: this._x2,
                y1: this._y1,
                y2: this._y2
            }
        },
        _updateNodePositions: function () {
            //updates the cache for node position/size
            //if positions and sizes changed, return true
            var changed = false;

            var newN1 = {
                x: this._n1._x,
                y: this._n1._y,
                w: this._n1._w,
                h: this._n1._h
            };
            var newN2 = {
                x: this._n2._x,
                y: this._n2._y,
                w: this._n2._w,
                h: this._n2._h
            };
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
        },
        _updateEndpoints: function () {
            //concept - endpoints can be calculated based on the positions and sizes of the two nodes
            //for now let's just be lazy and do centers
            if (!this._updateNodePositions()) return;

            this._x1 = (2 * this._oldN1.x + this._oldN1.w) / 2
            this._x2 = (2 * this._oldN2.x + this._oldN2.w) / 2
            this._y1 = (2 * this._oldN1.y + this._oldN1.h) / 2
            this._y2 = (2 * this._oldN2.y + this._oldN2.h) / 2
        }
    }

    function distance(x1, y1, x2, y2) {
        //distance between two points
        return Math.sqrt(
            Math.pow(y2 - y1, 2)
            + Math.pow(x2 - x1, 2)
        );
    }

    visualElement.createEdge = function (node1, node2, stroke = 'green') {
        return new Edge(node1, node2, stroke);
    }

})(jQuery, window);