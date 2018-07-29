/**
 * user interaction events, to interact with the canvas and manipulate the family tree
 */
(function ($, window, undefined) {
    'use strict';
    var familyApi = window.familyApi = window.familyApi || {};
    var defaults = {
        container: '#canvas-container',
        width: 1366,
        height: 720,
        clear: '.clear',
        zoomIn: '.zoom-in',
        zoomOut: '.zoom-out',
        zoomReset: '.zoom-reset',
        panReset: '.pan-reset'
    };
    var families = [];

    function Family(container, width, height){
        this._container = container;
        this._canvas = canvasApi.createInstance({
            container: container, width: width, height: height
        });
        this._people = [];
        this._relationships = [];

        createCanvasControls(this);
        createFamilyControls(this);
        initBindings(this);
    }

    familyApi.createInstance = function (overrides) {
        var settings = $.extend(true, {}, defaults, overrides);

        //only one family per container
        var old = getInstance(settings.container);
        if (old) return old;

        let instance = new Family(settings.container, settings.width, settings.height);
        return instance;
    }

    var getInstance = familyApi.getInstance = function(container){
        for (let i = 0; i < families.length; i++) {
            var objInstance = families[i];
            if (objInstance._container == container) return objInstance;
        }
        return false;
    }

    function createCanvasControls(family){
        var $container = $(family._container);
        var $controls = $('<div>',{class:'canvas-controls'}).appendTo($container);

        $('<button>', {class: 'zoom-in'}).text('+').appendTo($controls);
        $('<button>', {class: 'zoom-out'}).text('-').appendTo($controls);
        $('<button>', {class: 'zoom-reset'}).text('Reset zoom').appendTo($controls);
        $('<button>', {class: 'pan-reset'}).text('Reset pan').appendTo($controls);
    }

    function createFamilyControls(family){
        var $container = $(family._container);
        var $controls = $('<div>',{class:'family-controls'}).appendTo($container);

        $('<button>', {class: 'clear'}).text('Clear canvas').appendTo($controls);
    }

    function initBindings(family) {
        var $container = $(family._container);
        var $canvas = family._canvas._$canvas;

        $container.on('click', defaults.clear, function () {
            family._canvas.removeAllElements();
        });

        $container.on('click', defaults.zoomIn, function () {
            family._canvas.zoom(1.25);
            family._canvas.render();
        });

        $container.on('click', defaults.zoomOut, function () {
            family._canvas.zoom(0.8);
            family._canvas.render();
        });

        $container.on('click', defaults.zoomReset, function () {
            family._canvas.resetZoom();
            family._canvas.render();
        });

        $container.on('click', defaults.panReset, function () {
            family._canvas.resetPan();
            family._canvas.render();
        });

        $canvas.on('wheel', function (e) {
            var dz = e.originalEvent.deltaY
            var zoom = dz ? dz < 0 ? 1.25 : 0.8 : 1;
            family._canvas.zoom(zoom, e.offsetX, e.offsetY);
            family._canvas.render();
        });

        var isActiveDrag = false;
        var justDragged = false;
        var start = { x: 0, y: 0 };
        var last = { x: 0, y: 0 };
        var current = { x: 0, y: 0 };
        var end = { x: 0, y: 0 };
        var elementsHit = [];
        var topNodeHit = false;
        var coords = { x: 0, y: 0 };

        $canvas.on('mousedown', function (e) {
            last = current = start = { x: e.offsetX, y: e.offsetY };
            isActiveDrag = true;
            justDragged = false;

            coords = family._canvas.getCoordinates(start.x, start.y);
            elementsHit = family._canvas.getElementsAt(coords.x, coords.y);
            if (elementsHit.nodes.length){
                topNodeHit = elementsHit.nodes[0];
            }
        });

        $canvas.on('mousemove', function (e) {
            last = current;
            current = { x: e.offsetX, y: e.offsetY };
            var dx = current.x - last.x;
            var dy = current.y - last.y;
            justDragged = true;
            if (isActiveDrag && topNodeHit) {
                //just dragged a thing
                var transform = family._canvas.getScaled(dx, dy);
                topNodeHit.moveBy(transform.x, transform.y);
                family._canvas.bringToFront(topNodeHit);
                family._canvas.render();
            } else if (isActiveDrag && !topNodeHit) {
                //just panned
                family._canvas.panBy(dx, dy);
                family._canvas.render();
            }
        });

        $canvas.on('mouseup', function (e) {
            var end = { x: e.offsetX, y: e.offsetY }
            if (!justDragged) {
                if (topNodeHit) {
                    //just clicked a thing
                    console.log(elementsHit);
                } else {
                    //just clicked empty space
                    var n = visualElement.createNode(coords.x, coords.y);
                    family._canvas.addNode(n);
                    family._canvas.render();
                }
            }

            isActiveDrag = false;
            elementsHit = [];
            topNodeHit = false;
        });
    }
})(jQuery, window);