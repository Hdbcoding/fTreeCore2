(function($, window, undefined){
    'use strict';
    var canvasApi = window.canvasApi = window.canvasApi || {};
    var defaults = {
        container: '', // container selector
        width: 500,
        height: 500
    };

    var canvases = [];

    //canvas API prototype
    // pwease no steppy on _private fields
    var api = {
        _init: function(container, width, height){
            this._container = container;
            this._width = width;
            this._height = height;
            this._$canvas = this._$canvas || $('<canvas>')
                .attr({width: width, height: height})
                .appendTo(container);
            this._elements = this._elements || [];
            this._ctx = this.ctx || this._$canvas[0].getContext('2d');
        },
        clear: function(){
            this._ctx.fillstyle = 'black';
            this._ctx.fillRect(0, 0, this._width, this._height);
        }
    };

    canvasApi.init = function(inputSettings){
        var settings = $.extend(true, {}, defaults, inputSettings);

        //only one canvas per container. If we've already added a canvas here return the old one
        var old = getCanvas(settings.container);
        if (old) return old;

        //create canvas using the ~~prototype~~
        let instance = Object.create(api);
        instance._init(settings.container, settings.width, settings.height);
        instance.clear();
        return instance;
    }

    function getCanvas(container){
        for (let i = 0; i < canvases.length; i++){
            var objInstance = canvases[i];
            if (objInstance.container == container) return objInstance;
        }
        return false;
    }
})($, window);