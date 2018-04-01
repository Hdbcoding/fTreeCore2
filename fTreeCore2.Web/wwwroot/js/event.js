(function ($, window, undefined){
    'use strict';
    var eventApi = window.eventApi = window.eventApi || {};

    var settings = {
        canvasContainer: '#canvas-container',
        canvasWidth: 1366,
        canvasHeight: 720,
        clear: '#clear',
        zoomIn: '#zoom-in',
        zoomOut: '#zoom-out',
        zoomReset: '#zoom-reset'
    }
    
    eventApi.init = function(overrides){
        $.extend(true, settings, overrides);

        var canvasInstance = window.canvasApi.init({
            container: settings.canvasContainer,
            height: settings.canvasHeight,
            width: settings.canvasWidth
        });
        canvasInstance.render();

        initBindings(canvasInstance);
    }

    function initBindings(instance){
        $(settings.clear).on('click', function(){
            instance.removeAllElements();
        });

        $(settings.zoomIn).on('click', function(){
            instance.zoomBy(1.25);
            instance.render();
        });

        $(settings.zoomOut).on('click', function(){
            instance.zoomBy(0.8);
            instance.render();
        });

        $(settings.zoomReset).on('click', function(){
            instance.resetZoom();
            instance.render();
        });

        instance._$canvas.on('click', function(e){
            var x = e.offsetX;
            var y = e.offsetY;

            var elementsHit = instance.getElementsAt(x, y);
            console.log(elementsHit);

            if (!elementsHit.length){
                var ele = window.visualElement.createNode(x, y);
                instance.addElement(ele);
                instance.render();
            }
        });
    }
})(jQuery, window);