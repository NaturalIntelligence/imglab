var tools = {
    labelling : {
        "tool-point" : {
            type: "point",
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            drawable : true,
            actions: ["landmark"],
            create : function(e,container){
                var canvasOffset = myCanvas.node.getBoundingClientRect();
                return getPointToDraw(e,container,canvasOffset);
            },
            validate: function(el){
                return true;
            }
        },
        // "tool-circle" : {
        //     type: "circle",
        //     title  : "Circle",
        //     desp : "Create a circle",
        //     icon : "circle.svg",
        //     drawable : true,
        //     create : function(){
        //         var circle =  myCanvas.nested().circle().radius().addClass('labelcircle shape')/* .draw() */;
        //         circle.resize();
        //         circle.parent().draggable();
        //         return circle;
        //     },
        //     validate: function(el){
        //         return Number.parseInt(el.attr("r")) > 3;
        //     }
        // },
        "tool-rectangle" : {
            type: "rect",
            title  : "方框标注",
            desp : "Create a Boundary boxrectangle",
            icon : "rectangle.svg",
            drawable : true,
            create : function(){
                var rect =  myCanvas.nested().rect().addClass('labelbox shape')/* .draw() */;
                rect.resize();
                rect.parent().draggable();
                return rect;
            },
            validate: function(el){
                return Number.parseInt(el.attr("width")) > 3;
            },
        }
        // ,
        // "tool-polygon" : {
        //     type: "poly",
        //     title  : "Polygon",
        //     desp : "Create a concave polygon",
        //     icon : "polygon.svg",
        //     drawable : true,
        //     create : function(){//TODO: bug: creating duplicate points
        //         var poly =  myCanvas.nested().polygon().addClass('labelpolygon shape')/* .draw() */;
        //         poly.resize();
        //         poly.parent().draggable();

        //         poly.on('drawstart', function(e){
        //             document.addEventListener('keydown', function(e){
        //                 if(e.keyCode == 13){
        //                     poly.draw('done');
        //                     poly.off('drawstart');

        //                      poly.on('dblclick', function(event){
        //                         if(selectedTool.type === "poly"){
        //                             var points = myCanvas.point(event.x, event.y);
        //                             var polyArray = poly.array().valueOf();
        //                             for(var p_i=0; p_i< polyArray.length; p_i++){
        //                                 var point1 = polyArray[ p_i];
        //                                 var point2 = [];

        //                                 if(i === length -1 ){
        //                                     point2 = polyArray[ 0];
        //                                 }else{
        //                                     point2 = polyArray[ p_i + 1 ];
        //                                 }
        //                                 var distance  = pDistance(point1[0], point1[1], point2[0], point2[1], points.x, points.y);
        //                                 if(distance < 11){
        //                                     polyArray.splice(p_i+1, 0, [points.x, points.y] );
        //                                     poly.plot(polyArray);
        //                                     break;
        //                                 }
        //                             }
        //                         }
        //                     }) 
        //                 }
        //             });
        //         });

        //         return poly;
        //     },
        //     validate: function(el){
        //         return true;
        //     },
        // }
    },
    canvas : {
        "tool-beenest": {
            title  : "任务面板",
            desp : "BeeNest Control Panel",
            icon : "bee.png",
            actions : ["beenest"]
        },
        "tool-audition": {
            title  : "审核面板",
            desp : "audit panel",
            icon : "bee.png",
            actions : ["auditing"]
        },
        "tool-move" : {
            title  : "移动目标",
            desp : "Move an element or the entire workarea",
            icon : "move.svg",
            type : "move"
        },
        "tool-zoom" : {
            title  : "缩放",
            desp : "Enlarge the workarea",
            icon_font : "icon-zoom-in",
            actions : ["zoom"]
        },
        "tool-light" : {
            title  : "亮度",
            desp : "Highlight the labels",
            icon_font : "icon-lightbulb",
            actions : ["lightbulb"]
        }
    }
};

function getPointToDraw(position,container,canvasOffset){
    var containerOffset = {
        x: container.parent().attr("x"),
        y: container.parent().attr("y")
    }
    var point =  container.parent().circle().radius(appConfig.featurePointSize).attr({ cx: position.x - canvasOffset.x - containerOffset.x, cy: position.y - canvasOffset.y - containerOffset.y}).addClass('labelpoint');
    point.draggable();
    return point;
}
var imgSelected = "";
var selectedElements = [];
var copiedElements;
var selectedTool = null, selectedElement = null;
var alreadyDrawing = false;

var plugins = {
    // "facepp" : {
    //     title: "Face Plus Plus",
    //     tagName: 'facepp'
    // },
    "beenest" : {
        title: "玉蜂谷设置",
        tagName: "beenest"
    }
}
var pluginsStore = {
    // "facepp" : {
    // },
    "beenest": {
        baseURL: "https://api.todview.com:8080/v1/"
    },
}

var suggestedCategories = ["dog", "cat", "car", "vehicle", "truck", "animal", "building", "person"];
var suggestedTags = [];
var suggestedAttributes = {
    "gender" : ["male", "female", "other"],
    "color" : ["red", "green", "blue", "orange", "yellow", "white", "black"],
};
