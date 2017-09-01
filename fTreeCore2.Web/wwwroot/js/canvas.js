(function($, window, undefined){
    'use strict';
    var canvasApi = window.canvasApi = window.canvasApi || {};
    var defaults = {
        container: '', // container selector
        width: 500,
        height: 500
    };

    canvasApi.init = function(inputSettings){
        var settings = $.extend(true, {}, defaults, inputSettings);

        var $canvas = $('<canvas>')
            .attr({width: settings.width, height: settings.height})
            .appendTo(settings.container);
        var api = {
            callout: function(){ console.log($canvas); }
        };

        return api;
    }


})($, window);