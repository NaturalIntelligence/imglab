var tools = {
    labelling : {
        "tool-point" : {
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            create : function(){
                var point =  myCanvas.circle().radius(3).addClass('labelpoint');
                point.draggable();
                return point/* .draw('stop') */;
            }
        },
        "tool-circle" : {
            title  : "Circle",
            desp : "Create a circle",
            icon : "point.svg",
            resizable: true,
            create : function(){
                var circle =  myCanvas.circle().radius().addClass('labelcircle').draw();
                circle.draggable().resize();
                return circle;
            }
        },
        "tool-rectangle" : {
            title  : "Rectangle",
            desp : "Create a Boundary boxrectangle",
            icon : "rectangle.svg",
            resizable: true,
            create : function(){
                var rect =  myCanvas.rect().addClass('labelbox').draw();
                rect.draggable().resize();
                return rect;
            }
        },
        "tool-polygon" : {
            title  : "Polygon",
            desp : "Create a concave polygon",
            icon : "polygon.svg"
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