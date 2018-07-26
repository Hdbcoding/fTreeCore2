/**
 * Visual elements, such as nodes and edges.
 * elements can be drawn on a canvas with a drawing context
 */
(function ($, window, undefined) {
    'use strict';
    var visualElement = window.visualElement = window.visualElement || {};

    //visual element: all visual elements can be drawn, and can report if they are in bounds
    //these are abstract operations that must be implemented
    var visualElementProto = {
        isInBounds: function () { throw 'abstract base method - implement isInBounds!'; },
        draw: function () { throw 'abstract base method - implement draw!'; }
    }

    //node: A box, with a shape and size, that can be moved around
    function Node(x, y, w, h, fill, stroke) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._fill = fill;
        this._stroke = stroke;
    }

    Node.prototype = Object.create(visualElementProto);
    Node.prototype.isInBounds = function (x, y) {
        return x >= this._x
            && x <= this._x + this._w
            && y >= this._y
            && y <= this._y + this._h;
    }
    Node.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.rect(this._x, this._y, this._w, this._h);
        ctx.fillStyle = this._fill;
        ctx.fill();
        ctx.strokeStyle = this._stroke;
        ctx.stroke();
        ctx.closePath();
    }
    Node.prototype.moveBy = function (dx, dy) {
        this._x += dx;
        this._y += dy;
    }
    Node.prototype.moveTo = function (x, y) {
        this._x = x;
        this._y = y;
    }
    Node.prototype.getShape = function () {
        return {
            x: this._x,
            y: this._y,
            w: this._w,
            h: this._h
        };
    }

    visualElement.isNode = function (n) {
        return Node.prototype.isPrototypeOf(n);
    }

    visualElement.createNode = function (x = 0, y = 0, w = 50, h = 50, fill = 'white', stroke = 'red') {
        return new Node(x, y, w, h, fill, stroke);
    }

    //base prototype for edges - edges are visual elements that have two endpoints
    //updating endpoints is an abstract operation
    var edgeProto = Object.create(visualElementProto);
    edgeProto.draw = function (ctx) {
        var ep = this.getEndpoints();
        ctx.beginPath();
        ctx.moveTo(ep.x1, ep.y1);
        ctx.lineTo(ep.x2, ep.y2);
        ctx.strokeStyle = this._stroke;
        ctx.stroke();
        ctx.closePath();
    }
    edgeProto.isInBounds = function (x, y) {
        //concept - an edge has some delta around it where clicks can be registered
        //distance from point to line must be smaller than delta to be a click
        var ep = this.getEndpoints();
        var delta = 10; //random delta, needs calculation
        var d = distanceFromLine(ep.x1, ep.y1, ep.x2, ep.y2, x, y);

        return d < delta;
    }
    edgeProto.getEndpoints = function () {
        this.updateEndpoints();
        return {
            x1: this._x1,
            y1: this._y1,
            x2: this._x2,
            y2: this._y2
        }
    }
    edgeProto.updateEndpoints = function () {
        throw 'abstract base method - implement updateEndpoints!';
    }
    edgeProto.isAttachedToNode = function(n) {
        throw 'abstract base method - implement isAttachedToNode!';
    }

    visualElement.isEdge = function(e){
        return edgeProto.isPrototypeOf(e);
    }

    //parentEdge: A line connecting two nodes
    function ParentEdge(n1, n2, stroke) {
        //concept - an edge is a connection between two nodes
        this._n1 = n1;
        this._n2 = n2;
        this._stroke = stroke;

        this.updateEndpoints();
    }

    ParentEdge.prototype = Object.create(edgeProto);
    ParentEdge.prototype.updateEndpoints = function () {
        //concept - endpoints can be calculated based on the positions and sizes of the two nodes
        //for now let's just be lazy and do centers
        if (!this._updateComponentPositions()) return;

        var center1 = centerOfRect(this._oldN1.x, this._oldN1.y, this._oldN1.w, this._oldN1.h);
        this._x1 = center1.x;
        this._y1 = center1.y;
        var center2 = centerOfRect(this._oldN2.x, this._oldN2.y, this._oldN2.w, this._oldN2.h);
        this._x2 = center2.x;
        this._y2 = center2.y;
    }
    ParentEdge.prototype._updateComponentPositions = function () {
        //updates the cache for node position/size
        //if positions and sizes changed, return true
        var changed = false;

        var newN1 = this._n1.getShape();
        var newN2 = this._n2.getShape();
        var oldN1 = this._oldN1 || {};
        var oldN2 = this._oldN2 || {};

        changed = !shapesEqual(newN1, oldN1) || !shapesEqual(newN2, oldN2);

        this._oldN1 = newN1;
        this._oldN2 = newN2;
        return changed;
    }
    ParentEdge.prototype.isAttachedToNode = function(n){
        return n == this._n1 || n == this._n2;
    }

    visualElement.createParentEdge = function (node1, node2, stroke = 'green') {
        return new ParentEdge(node1, node2, stroke);
    }

    //childEdge: a line connecting an edge to a node
    function ChildEdge(e, n, stroke) {
        this._e = e;
        this._n = n;
        this._stroke = stroke;

        this.updateEndpoints();
    }

    ChildEdge.prototype = Object.create(edgeProto);
    ChildEdge.prototype.updateEndpoints = function () {
        //calculate endpoints based on the position and size of the node and edge
        if (!this._updateComponentPositions()) return;

        var center1 = centerOfRect(this._oldN.x, this._oldN.y, this._oldN.w, this._oldN.h);
        this._x1 = center1.x;
        this._y1 = center1.y;
        var center2 = centerOfLine(this._oldE.x1, this._oldE.y1, this._oldE.x2, this._oldE.y2);
        this._x2 = center2.x;
        this._y2 = center2.y;
    }
    ChildEdge.prototype._updateComponentPositions = function () {
        //updates the cache for node position/size
        //if positions and sizes changed, return true
        var changed = false;
        var newN = this._n.getShape();
        var newE = this._e.getEndpoints();
        var oldN = this.oldN || {};
        var oldE = this.oldE || {};

        changed = !shapesEqual(newN, oldN) || !endpointsEqual(newE, oldE);

        this._oldN = newN;
        this._oldE = newE;

        return changed;
    }
    ChildEdge.prototype.isAttachedToNode = function(n){
        return this._n == n;
    }
    ChildEdge.prototype.isAttachedToEdge = function(e){
        return this._e == e;
    }

    visualElement.isChildEdge = function(e){
        return ChildEdge.prototype.isPrototypeOf(e);
    }

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
            x: x + w / 2,
            y: y + h / 2
        };
    }

    function shapesEqual(s1, s2) {
        return s1.x == s2.x && s1.y == s2.y
            && s1.w == s2.w && s1.h == s2.h
    }

    function endpointsEqual(ep1, ep2) {
        return ep1.x1 == ep2.x1 && ep1.y1 == ep2.y1
            && ep1.x2 == ep2.x2 && ep1.y2 == ep2.y2
    }

})(jQuery, window);