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
            instance.zoomBy(1.25);
            instance.render();
        });

        $(settings.zoomOut).on('click', function () {
            instance.zoomBy(0.8);
            instance.render();
        });

        $(settings.zoomReset).on('click', function () {
            instance.resetZoom();
            instance.render();
        });

        $(settings.panReset).on('click', function(){
            instance.resetPan();
            instance.render();
        })

        instance._$canvas.on('click', function (e) {
            if (!justDragged) {
                var x = e.offsetX;
                var y = e.offsetY;

                var elementsHit = instance.getElementsAt(x, y);
                if (!elementsHit.length) {
                    var coords = instance.getCoordinates(x,y);
                    var ele = window.visualElement.createNode(coords.x, coords.y);
                    instance.addElement(ele);
                    instance.render();
                }
                else {
                    //todo - do something with hit elements
                    console.log(elementsHit);
                }
            }
        });

        var isActiveDrag = false;
        var justDragged = false;
        var start = { x: 0, y: 0 };
        var last = { x: 0, y: 0 };
        var current = { x: 0, y: 0 };
        var end = { x: 0, y: 0 };
        instance._$canvas.on('mousedown', function (e) {
            last = current = start = { x: e.offsetX, y: e.offsetY };
            isActiveDrag = true;
            justDragged = false;
        });

        instance._$canvas.on('mousemove', function (e) {
            last = current;
            current = { x: e.offsetX, y: e.offsetY };
            justDragged = true;
            if (isActiveDrag) {
                var dx = current.x - last.x;
                var dy = current.y - last.y;
                instance.panBy(dx, dy);
                instance.render();
            }
        });

        instance._$canvas.on('mouseup', function (e) {
            var end = { x: e.offsetX, y: e.offsetY }
            isActiveDrag = false;
        });
    }
})(jQuery, window);