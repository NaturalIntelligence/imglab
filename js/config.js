var tools = {
    labelling : {
        "tool-point" : {
            type: "point",
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            drawable : true,
            create : function(e,container){
                var offset = container.node.getBoundingClientRect();
                var point =  myCanvas.circle().radius(3).attr({ cx: e.x - offset.left, cy: e.y - offset.top}).addClass('labelpoint');
                point.draggable();
                return point;
            },
            validate: function(el){
                return true;
            }
        },
        "tool-circle" : {
            type: "circle",
            title  : "Circle",
            desp : "Create a circle",
            icon : "point.svg",
            drawable : true,
            create : function(){
                var circle =  myCanvas.circle().radius().addClass('labelcircle').draw();
                circle.draggable().resize();
                return circle;
            },
            validate: function(el){
                return Number.parseInt(el.attr("r")) > 3;
            }
        },
        "tool-rectangle" : {
            type: "rect",
            title  : "Rectangle",
            desp : "Create a Boundary boxrectangle",
            icon : "rectangle.svg",
            drawable : true,
            create : function(){
                var rect =  myCanvas.rect().addClass('labelbox').draw();
                rect.draggable().resize();
                return rect;
            },
            validate: function(el){
                return Number.parseInt(el.attr("width")) > 3;
            }
        },
        "tool-polygon" : {
            type: "poly",
            title  : "Polygon",
            desp : "Create a concave polygon",
            icon : "polygon.svg",
            drawable : true,
            create : function(){
                var poly =  myCanvas.polygon().addClass('labelbox').draw();
                poly.draggable().resize();

                poly.on('drawstart', function(e){
                    document.addEventListener('keydown', function(e){
                        if(e.keyCode == 13){
                            poly.draw('done');
                            poly.off('drawstart');
                        }
                    });
                });

                return poly;
            },
            validate: function(el){
                return true;
            }
        }
    },
    canvas : {
        "tool-move" : {
            title  : "Move",
            desp : "Move an element or the entire workarea",
            icon : "move.svg"
        },
        "tool-zoom-in" : {
            title  : "Zoom In",
            desp : "Enlarge the workarea",
            icon : "zoomin.svg"
        },
        "tool-zoom-out" : {
            title  : "Zoom Out",
            desp : "Create a concave polygon",
            icon : "zoomout.svg"
        },
        "tool-labels-only" : {
            title  : "Labels only",
            desp : "Hide the image",
            icon : "lightbulb.svg"
        }
    }
};

var selectedLabels = [];
var selectedTool = null, selectedElement = null;
var alreadyDrawing = false;