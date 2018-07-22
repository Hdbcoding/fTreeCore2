/**
 * user interaction events, to interact with the canvas and manipulate the family tree
 */
(function ($, window, undefined) {
    'use strict';
    var eventApi = window.eventApi = window.eventApi || {};

    var settings = {
        canvasContainer: '#canvas-container',
        canvasWidth: 1366,
        canvasHeight: 720,
        clear: '#clear',
        zoomIn: '#zoom-in',
        zoomOut: '#zoom-out',
        zoomReset: '#zoom-reset',
        panReset: '#pan-reset'
    }

    eventApi.init = function (overrides) {
        $.extend(true, settings, overrides);

        var canvasInstance = window.canvasApi.init({
            container: settings.canvasContainer,
            height: settings.canvasHeight,
            width: settings.canvasWidth
        });
        canvasInstance.render();

        initBindings(canvasInstance);
    }

    function initBindings(instance) {
        $(settings.clear).on('click', function () {
            instance.removeAllElements();
        });

        $(settings.zoomIn).on('click', function () {
            instance.zoom(1.25);
            instance.render();
        });

        $(settings.zoomOut).on('click', function () {
            instance.zoom(0.8);
            instance.render();
        });

        $(settings.zoomReset).on('click', function () {
            instance.resetZoom();
            instance.render();
        });

        $(settings.panReset).on('click', function () {
            instance.resetPan();
            instance.render();
        });

        instance._$canvas.on('wheel', function (e) {
            var dz = e.originalEvent.deltaY
            var zoom = dz ? dz < 0 ? 1.25 : 0.8 : 1;
            instance.zoom(zoom, e.offsetX, e.offsetY);
            instance.render();
        });


        var isActiveDrag = false;
        var justDragged = false;
        var start = { x: 0, y: 0 };
        var last = { x: 0, y: 0 };
        var current = { x: 0, y: 0 };
        var end = { x: 0, y: 0 };
        var elementsHit = [];
        var topElementHit = false;
        var coords = { x: 0, y: 0 };

        instance._$canvas.on('mousedown', function (e) {
            last = current = start = { x: e.offsetX, y: e.offsetY };
            isActiveDrag = true;
            justDragged = false;

            coords = instance.getCoordinates(start.x, start.y);
            elementsHit = instance.getElementsAt(coords.x, coords.y);
            if (elementsHit.length) {
                topElementHit = elementsHit[0];
            }
        });

        instance._$canvas.on('mousemove', function (e) {
            last = current;
            current = { x: e.offsetX, y: e.offsetY };
            var dx = current.x - last.x;
            var dy = current.y - last.y;
            justDragged = true;
            if (isActiveDrag && topElementHit) {
                //just dragged a thing
                var transform = instance.getScaled(dx, dy);
                topElementHit.moveBy(transform.x, transform.y);
                instance.bringToFront(topElementHit);
                instance.render();
            } else if (isActiveDrag && !topElementHit) {
                //just panned
                instance.panBy(dx, dy);
                instance.render();
            }
        });

        instance._$canvas.on('mouseup', function (e) {
            var end = { x: e.offsetX, y: e.offsetY }
            if (!justDragged) {
                if (topElementHit) {
                    //just clicked a thing
                    console.log(elementsHit);
                } else {
                    //just clicked empty space
                    var ele = window.visualElement.createNode(coords.x, coords.y);
                    instance.addElement(ele);
                    instance.render();
                }
            }

            isActiveDrag = false;
            elementsHit = [];
            topElementHit = false;
        });
    }
})(jQuery, window);