var tools = {
    labelling : {
        "tool-point" : {
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg"
        },
        "tool-rectangle" : {
            title  : "Rectangle",
            desp : "Create a Boundary boxrectangle",
            icon : "rectangle.svg",
            create : function(){
                var rect =  myCanvas.rect().addClass('labelbox').draw();
                rect.draggable();
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