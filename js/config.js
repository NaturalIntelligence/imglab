var tools = {
    labelling : {
        "tool-point" : {
            type: "point",
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            drawable : true,
            create : function(e,container){
                var canvasOffset = myCanvas.node.getBoundingClientRect();
                containerOffset = {
                    x: container.parent().attr("x"),
                    y :container.parent().attr("y")
                }
                //TODO : extract code to calculate point position
                var point =  container.parent().circle().radius(3).attr({ cx: e.x - canvasOffset.x - containerOffset.x, cy: e.y - canvasOffset.y - containerOffset.y}).addClass('labelpoint');
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
                var circle =  myCanvas.nested().circle().radius().addClass('labelcircle shape').draw();
                circle.resize();
                circle.parent().draggable();
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
                var rect =  myCanvas.nested().rect().addClass('labelbox shape').draw();
                rect.resize();
                rect.parent().draggable();
                return rect;
            },
            validate: function(el){
                return Number.parseInt(el.attr("width")) > 3;
            },
        },
        "tool-polygon" : {
            type: "poly",
            title  : "Polygon",
            desp : "Create a concave polygon",
            icon : "polygon.svg",
            drawable : true,
            create : function(){
                var poly =  myCanvas.nested().polygon().addClass('labelbox shape').draw();
                poly.resize();
                poly.parent().draggable();

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
            },
        }
    },
    canvas : {
        "tool-move" : {
            title  : "Move",
            desp : "Move an element or the entire workarea",
            icon : "move.svg",
            type : "move",
        },
        "tool-zoom-in" : {
            title  : "Zoom In",
            desp : "Enlarge the workarea",
            icon : "zoomin.svg",
        },
        "tool-zoom-out" : {
            title  : "Zoom Out",
            desp : "Create a concave polygon",
            icon : "zoomout.svg",
        },
        "tool-labels-only" : {
            title  : "Labels only",
            desp : "Hide the image",
            icon : "lightbulb.svg",
        }
    }
};

var imgSelected = "";
var selectedElements = [];
var selectedTool = null, selectedElement = null;
var alreadyDrawing = false;