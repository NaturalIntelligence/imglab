var yoloFormater = {
    fromYOLO : function() {

    },
    //toYOLO() returns YOLO-annotation formatted data as string
    toYOLO: function () {
        var yoloData = ""; //Initializing empty output string
        var categories = []; //Initializing categories as empty array
        var image = labellingData[imgSelected.name]; //Currently selected image
        for (var shape_i = 0; shape_i < image.shapes.length; shape_i++) {
            var shape = image.shapes[shape_i]; //Current shape
            if (categories.indexOf(shape.category) == -1) {
                categories.push(shape.category); //Push shape category to categories array if not already contained
            }
            var dw = 1. / imgSelected.size.width; //Reciprocal of image width
            var dh = 1. / imgSelected.size.height; //Reciprocal of image height
            var cat = categories.indexOf(shape.category); //Index of shape category in categories array
            var w = shape.bbox.w; //width of shape
            var h = shape.bbox.h; //height of shape
            var x = shape.bbox.x + 0.5*w; //x-coordinate of centre of shape
            var y = shape.bbox.y + 0.5 * h; //y-coordinate of centre of shape
            var f = shape.zoomScale / imgSelected.size.imageScale //Factor to adjust sizes according to zoom;
            x *= dw; //x is calculated as a ratio of shape width
            x *= f;
            y *= dh; //y is calculated as a ratio of shape width
            y *= f;
            w *= dw; //w is calculated as a ratio of shape width
            w *= f;
            h *= dh; //h is calculated as a ratio of shape width
            h *= f;
            yoloData += cat.toString() + " " + x.toString() + " " + y.toString() + " " + w.toString() + " " + h.toString(); //YOLO annotation format
            if (shape_i < image.shapes.length - 1) {
                yoloData += "\r\n"; //insert line break if another shape is to be processed
            }
        }
        return yoloData;
    }
}