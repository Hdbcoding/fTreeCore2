//bundle configs

module.exports = {
    bundle: {
        familyTree: {
            scripts: [
                './wwwroot/js/canvas.js',
                './wwwroot/js/visualElement.js',
                './wwwroot/js/event.js'
            ],
            styles: ['./wwwroot/css/site.css']
        },
        lib: {
            scripts: [
                './wwwroot/lib/js/jquery.slim.min.js',
                './wwwroot/lib/js/popper.min.js',
                './wwwroot/lib/js/bootstrap.min.js'
            ],
            styles: ['./wwwroot/lib/css/bootstrap.min.css'],
            options: {
              maps: false
            }
        }
    }
};